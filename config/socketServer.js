import { Server } from 'socket.io';
import { saveMessageService, saveMessageReadStatusService, fetchMessagesService } from '../src/chat/chat.service.js';
import { isUserInCommunityDao, fetchMessagesDao, fetchMessageByIdDao } from '../src/chat/chat.dao.js';
import { BaseError } from './error.js';
import { status } from '../config/response.status.js';

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {

        socket.on('joinRoom', async ({ communityId, userId, page = 1, size = 20 }) => {
            try {
                if (socket.rooms.has(communityId)) {
                    return;
                }

                const isMember = await isUserInCommunityDao(communityId, userId);

                if (isMember) {
                    socket.join(communityId);
                    socket.userId = userId;
                    socket.communityId = communityId;

                    const { result: messages, pageInfo } = await fetchMessagesService(communityId, userId, page, size);
                    socket.emit('loadMessages', { messages, pageInfo });

                    if (messages.length > 0) {
                        const latestMessage = messages[messages.length - 1];
                        await saveMessageReadStatusService(latestMessage.messageId, userId);
                    }
                    io.to(communityId).emit('messageRead', { userId, communityId });

                    socket.emit('joinRoomSuccess', { message: `방 ${communityId}에 성공적으로 참여했습니다.`, userId });
                } else {
                    throw new BaseError({ ...status.UNAUTHORIZED, message: '이 방에 참여할 권한이 없습니다.' });
                }
            } catch (error) {
                if (error instanceof BaseError) {
                    socket.emit('joinRoomError', error.message);
                } else {
                    socket.emit('joinRoomError', '방에 참여하는 중 오류가 발생했습니다.');
                }
            }
        });

        socket.on('loadMessages', async ({ communityId, page = 1, size = 20 }) => {
            try {
                if (socket.rooms.has(communityId)) {
                    const { result: messages, pageInfo } = await fetchMessagesService(communityId, socket.userId, page, size);
                    socket.emit('loadMessages', { messages, pageInfo });

                    const lastMessage = messages[messages.length - 1];
                    if (lastMessage) {
                        await saveMessageReadStatusService(lastMessage.messageId, socket.userId);
                        io.to(communityId).emit('messageRead', { messageId: lastMessage.messageId });
                    }
                }
            } catch (error) {
                if (error instanceof BaseError) {
                    socket.emit('error', error.message);
                } else {
                    socket.emit('error', '메시지를 로드하는 중 오류가 발생했습니다.');
                }
            }
        });

        socket.on('sendMessage', async ({ message, communityId }) => {
            try {
                if (socket.rooms.has(communityId)) {
                    const messageData = await saveMessageService(communityId, socket.userId, message);
                    if (messageData && messageData.messageId) {
                        io.to(communityId).emit('message', messageData);
                        io.to(communityId).emit('messageRead', { messageId: messageData.messageId });
                    }
                }
            } catch (error) {
                if (error instanceof BaseError) {
                    socket.emit('error', error.message);
                } else {
                    socket.emit('error', '메시지를 보내는 중 오류가 발생했습니다.');
                }
            }
        });

        socket.on('messageRead', async ({ messageId }) => {
            try {
                if (!messageId) {
                    throw new BaseError({ ...status.BAD_REQUEST, message: '메시지 ID가 제공되지 않았습니다.' });
                }
                const message = await fetchMessageByIdDao(messageId);
                if (message) {
                    await saveMessageReadStatusService(messageId, socket.userId);
                    io.to(socket.communityId).emit('messageRead', { messageId });
                }
            } catch (error) {
                if (error instanceof BaseError) {
                    socket.emit('error', error.message);
                } else {
                    socket.emit('error', '메시지 읽음 처리 중 오류가 발생했습니다.');
                }
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
            } catch (error) {
                if (error instanceof BaseError) {
                    socket.emit('error', error.message);
                } else {
                    socket.emit('error', '읽음 상태 업데이트 중 오류가 발생했습니다.');
                }
            }
        });

        socket.on('disconnect', () => {

            if (socket.communityId) {
                socket.leave(socket.communityId);
            }

        });
    });

    return io;
};

export default initializeSocket;
