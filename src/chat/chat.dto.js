export const getMessagesDto = (messages) => {
    return messages.map(message => ({
        messageId: message.message_id,
        userId: message.user_id,
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
