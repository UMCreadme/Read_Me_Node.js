export const GET_MESSAGES = `
    SELECT m.message_id, m.user_id, u.nickname, u.image_url, m.content, m.created_at
    FROM MESSAGE m
    JOIN USERS u ON m.user_id = u.user_id
    WHERE m.community_id = ?
    ORDER BY m.created_at DESC 
    LIMIT ? OFFSET ?
`;

export const INSERT_MESSAGE = `
    INSERT INTO MESSAGE (community_id, user_id, content, created_at)
    VALUES (?, ?, ?, NOW());
`;

export const INSERT_OR_UPDATE_MESSAGE_READ_STATUS = `
    INSERT INTO MESSAGE_READ_STATUS (latest_message_id, user_id, community_id, created_at)
    VALUES (?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE 
        latest_message_id = VALUES(latest_message_id),
        created_at = VALUES(created_at);
`;


export const SELECT_COMMUNITY_BY_ID = `
    SELECT * FROM COMMUNITY WHERE community_id = ?
`;

export const COUNT_USER_IN_COMMUNITY = `
    SELECT COUNT(*) as count 
    FROM COMMUNITY_USERS
    WHERE community_id = ? AND user_id = ?
`;

export const SELECT_MESSAGE_BY_ID = `
    SELECT * FROM MESSAGE WHERE message_id = ?
`;

export const COUNT_MESSAGES = `
    SELECT COUNT(*) as count 
    FROM MESSAGE 
    WHERE community_id = ?
`;
