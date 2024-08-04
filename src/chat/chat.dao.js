import { pool } from '../../config/db.config.js';
import { GET_MESSAGES, INSERT_MESSAGE, INSERT_MESSAGE_READ_STATUS } from './chat.sql.js';

// 메시지 조회
export const fetchMessagesDao = async (communityId) => {
    const [rows] = await pool.query(GET_MESSAGES, [communityId]);
    return rows;
};

// 메시지 삽입
export const saveMessageDao = async (communityId, userId, content) => {
    const [result] = await pool.query(INSERT_MESSAGE, [communityId, userId, content]);
    return result.insertId;
};

// 메시지 읽기 상태 저장
export const saveMessageReadStatusDao = async (messageId, userId) => {
    await pool.query(INSERT_MESSAGE_READ_STATUS, [messageId, userId]);
};
