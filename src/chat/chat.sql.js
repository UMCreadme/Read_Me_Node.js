// 채팅 메시지 조회 쿼리
export const GET_MESSAGES = `
    SELECT * FROM MESSAGE
    WHERE community_id = ?
    ORDER BY created_at ASC;
`;

// 채팅 메시지 삽입 쿼리
export const INSERT_MESSAGE = `
    INSERT INTO MESSAGE (community_id, user_id, content, created_at)
    VALUES (?, ?, ?, NOW());
`;

// 메시지 읽기 상태 삽입 쿼리
export const INSERT_MESSAGE_READ_STATUS = `
    INSERT INTO MESSAGE_READ_STATUS (message_id, user_id, created_at)
    VALUES (?, ?, NOW());
`;
