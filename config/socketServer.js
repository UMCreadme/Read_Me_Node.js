import { Server } from 'socket.io';
import { saveMessageService, saveMessageReadStatusService, fetchMessagesService } from '../src/chat/chat.service.js';
import { isUserInCommunityDao, fetchMessagesDao, fetchMessageByIdDao } from '../src/chat/chat.dao.js';

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

                    // 전체 메시지 가져오기 및 전송
                    const { result: messages, pageInfo } = await fetchMessagesService(communityId, userId, page, size);
                    socket.emit('loadMessages', { messages, pageInfo });

                    // 최근 메시지의 읽음 상태만 업데이트
                    if (messages.length > 0) {
                        const latestMessage = messages[messages.length - 1];
                        console.log(`최신 메시지 ID: ${latestMessage.messageId}`); // 디버그용 로그 추가
                        await saveMessageReadStatusService(latestMessage.messageId, userId);
                    }
                    io.to(communityId).emit('messagesRead', { userId, communityId });

                    console.log(`사용자 ${userId}가 방 ${communityId}에 참여했습니다.`);
                    socket.emit('joinRoomSuccess', { message: `방 ${communityId}에 성공적으로 참여했습니다.` });
                } else {
                    socket.emit('joinRoomError', '이 방에 참여할 권한이 없습니다.');
                }
            } catch (error) {
                socket.emit('joinRoomError', '방에 참여하는 중 오류가 발생했습니다.');
                console.error('joinRoom 오류:', error);
            }
        });

        socket.on('loadMessages', async ({ communityId, page = 1, size = 20 }) => {
            try {
                if (socket.rooms.has(communityId)) {
                    const { result: messages, pageInfo } = await fetchMessagesService(communityId, socket.userId, page, size);
                    socket.emit('loadMessages', { messages, pageInfo });

                    // 방 참여 시 마지막 메시지의 읽음 상태 업데이트
                    const lastMessage = messages[messages.length - 1];
                    if (lastMessage) {
                        console.log(`로드된 메시지 ID: ${lastMessage.messageId}`); // 디버그용 로그 추가
                        await saveMessageReadStatusService(lastMessage.messageId, socket.userId);
                        io.to(communityId).emit('messageRead', { messageId: lastMessage.messageId });
                    }

                    console.log(`방 ${communityId}에서 메시지 로드 완료`);
                } else {
                    console.error('사용자가 방에 없습니다.');
                }
            } catch (error) {
                console.error('메시지 로드 오류:', error);
            }
        });

        socket.on('sendMessage', async ({ message, communityId }) => {
            try {
                if (socket.rooms.has(communityId)) {
                    const messageData = await saveMessageService(communityId, socket.userId, message);
                    if (messageData && messageData.messageId) {
                        io.to(communityId).emit('message', messageData);

                        // 메시지 전송 후 모든 사용자에게 읽음 상태 업데이트
                        io.to(communityId).emit('messageRead', { messageId: messageData.messageId });

                        console.log(`방 ${communityId}에 메시지 전송: ${message}`);
                    } else {
                        console.error('메시지 전송에 실패했습니다.');
                    }
                } else {
                    console.error('사용자가 방에 없습니다.');
                }
            } catch (error) {
                console.error('sendMessage 오류:', error);
            }
        });

        socket.on('messageRead', async ({ messageId }) => {
            try {
                if (!messageId) {
                    console.error('messageRead 오류: 메시지 ID가 제공되지 않았습니다.');
                    return;
                }
                const message = await fetchMessageByIdDao(messageId);
                if (message) {
                    await saveMessageReadStatusService(messageId, socket.userId);
                    io.to(socket.communityId).emit('messageRead', { messageId });
                } else {
                    console.error(`메시지 ID ${messageId}를 찾을 수 없습니다.`);
                }
            } catch (error) {
                console.error(`messageRead 오류: ${error.message}, 메시지 ID: ${messageId}`);
            }
        });

        socket.on('updateReadStatus', async ({ communityId }) => {
            try {
                const messages = await fetchMessagesDao(communityId);
                for (const message of messages) {
                    if (message.readBy && !message.readBy.includes(socket.userId)) {
                        await saveMessageReadStatusService(message.messageId, socket.userId);
                    }
                }
                console.log(`방 ${communityId}의 모든 메시지 읽음 상태 업데이트 완료`);
            } catch (error) {
                console.error('updateReadStatus 오류:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('사용자 연결 해제됨', socket.id);
        });
    });

    return io;
};

export default initializeSocket;
