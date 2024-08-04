import { fetchMessagesDao, saveMessageDao, saveMessageReadStatusDao } from './chat.dao.js';
import { getMessagesDto, postMessageDto } from './chat.dto.js';

export const fetchMessagesService = async (communityId) => {
    const messages = await fetchMessagesDao(communityId);
    return getMessagesDto(messages);
};

export const saveMessageService = async (communityId, userId, content) => {
    const messageId = await saveMessageDao(communityId, userId, content);
    return postMessageDto({ message_id: messageId, user_id: userId, content });
};

export const saveMessageReadStatusService = async (messageId, userId) => {
    await saveMessageReadStatusDao(messageId, userId);
};
