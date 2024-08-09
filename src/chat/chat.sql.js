// SQL queries for chat operations

// Fetch messages from a specific community with user details
export const GET_MESSAGES = `
        SELECT m.message_id, m.user_id, u.nickname, u.image_url, m.content, m.created_at
        FROM MESSAGE m
        JOIN USERS u ON m.user_id = u.user_id
        WHERE m.community_id = ?
        ORDER BY m.created_at DESC
        LIMIT ? OFFSET ?
    `;


// Insert a new message into the MESSAGE table
export const INSERT_MESSAGE = `
    INSERT INTO MESSAGE (community_id, user_id, content, created_at)
    VALUES (?, ?, ?, NOW());
`;

// Insert or update the read status of a message for a user
export const INSERT_OR_UPDATE_MESSAGE_READ_STATUS = `
    INSERT INTO MESSAGE_READ_STATUS (message_id, user_id, created_at)
    VALUES (?, ?, NOW())
    ON DUPLICATE KEY UPDATE created_at = VALUES(created_at);
`;

// Select a community by its ID
export const SELECT_COMMUNITY_BY_ID = 'SELECT * FROM COMMUNITY WHERE community_id = ?';

// Count the number of users in a specific community
export const COUNT_USER_IN_COMMUNITY = `
    SELECT COUNT(*) as count 
    FROM COMMUNITY_USERS
    WHERE community_id = ? AND user_id = ?
`;

// Fetch a message by its ID
export const SELECT_MESSAGE_BY_ID = 'SELECT * FROM MESSAGE WHERE message_id = ?';
