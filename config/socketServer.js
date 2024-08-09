import { Server } from 'socket.io';
import { saveMessageService, saveMessageReadStatusService, fetchMessagesService } from '../src/chat/chat.service.js';
import { isUserInCommunityDao, fetchMessagesDao } from '../src/chat/chat.dao.js';

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('사용자 연결됨', socket.id);

        socket.on('joinRoom', async ({ communityId, userId, page = 1, size = 20 }) => {
            try {
                if (socket.rooms.has(communityId)) {
                    console.log(`사용자 ${userId}는 이미 방 ${communityId}에 있습니다.`);
                    return;
                }

                const isMember = await isUserInCommunityDao(communityId, userId);

                if (isMember) {
                    socket.join(communityId);
                    socket.userId = userId;
                    socket.communityId = communityId;

                    // 메시지 가져오기 및 전송
                    const { result: messages, pageInfo } = await fetchMessagesService(communityId, userId, page, size);
                    socket.emit('loadMessages', { messages, pageInfo });

                    // 방 참여 시 마지막 메시지의 읽음 상태 업데이트
                    const lastMessageId = messages[messages.length - 1]?.message_id;
                    if (lastMessageId) {
                        await saveMessageReadStatusService(lastMessageId, userId);
                        io.to(communityId).emit('messageRead', { messageId: lastMessageId });
                    }

                    console.log(`사용자 ${userId}가 방 ${communityId}에 참여했습니다.`);
                    socket.emit('joinRoomSuccess', { message: `방 ${communityId}에 성공적으로 참여했습니다.` });
                } else {
                    socket.emit('joinRoomError', '이 방에 참여할 권한이 없습니다.');
                }
            } catch (error) {
                socket.emit('joinRoomError', '방에 참여하는 중 오류가 발생했습니다.');
                console.error(error);
            }
        });

        socket.on('loadMessages', async ({ communityId, page, size }) => {
            try {
                const { result: messages, pageInfo } = await fetchMessagesService(communityId, socket.userId, page, size);
                socket.emit('loadMessages', { messages, pageInfo });
            } catch (error) {
                console.error('추가 메시지 로드 중 오류:', error);
            }
        });

        socket.on('sendMessage', async ({ message, communityId }) => {
            try {
                if (socket.rooms.has(communityId)) {
                    const messageData = await saveMessageService(communityId, socket.userId, message);
                    io.to(communityId).emit('message', messageData);

                    // 모든 사용자에게 메시지 읽음 상태 업데이트 요청 전송
                    io.to(communityId).emit('updateReadStatus', { communityId });
                    console.log(`방 ${communityId}에 메시지 전송: ${message}`);
                } else {
                    console.error('사용자가 방에 없습니다.');
                }
            } catch (error) {
                console.error('메시지 전송 오류:', error);
            }
        });

        socket.on('messageRead', async ({ messageId }) => {
            try {
                const updatedMessageId = await saveMessageReadStatusService(messageId, socket.userId);
                io.to(socket.communityId).emit('messageRead', { messageId: updatedMessageId });
            } catch (error) {
                console.error('읽음 상태 업데이트 오류:', error);
            }
        });

        socket.on('updateReadStatus', async ({ communityId }) => {
            try {
                const messages = await fetchMessagesDao(communityId);
                for (const message of messages) {
                    const readBy = message.readBy || [];
                    if (!readBy.includes(socket.userId)) { // 읽음 상태가 아닌 경우에만 업데이트
                        await saveMessageReadStatusService(message.message_id, socket.userId);
                    }
                }
                console.log(`방 ${communityId}의 모든 메시지 읽음 상태 업데이트 완료`);
            } catch (error) {
                console.error('읽음 상태 업데이트 오류:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('사용자 연결 해제됨', socket.id);
        });
    });

    return io;
};

export default initializeSocket;
