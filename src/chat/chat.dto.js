// chat.dto.js

export const getMessagesDto = (messages, currentUserId) => {
    return messages.map(message => ({
        messageId: message.message_id,
        userId: message.user_id,
        nickname: message.nickname,
        isMine: message.user_id === currentUserId,
        profileImg: message.profile_img,
        content: message.content,
        createdAt: message.created_at
    }));
};

export const postMessageDto = (message) => {
    return {
        messageId: message.message_id,
        userId: message.user_id,
        content: message.content,
        createdAt: message.created_at
    };
};
