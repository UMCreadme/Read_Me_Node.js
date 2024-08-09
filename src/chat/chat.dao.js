import { pool } from '../../config/db.config.js';
import {
    GET_MESSAGES,
    INSERT_MESSAGE,
    INSERT_OR_UPDATE_MESSAGE_READ_STATUS,
    SELECT_COMMUNITY_BY_ID,
    COUNT_USER_IN_COMMUNITY,
    SELECT_MESSAGE_BY_ID
} from './chat.sql.js';
import { status } from '../../config/response.status.js';

// 커뮤니티 조회 쿼리
export const fetchCommunityByIdDao = async (communityId) => {
    const [rows] = await pool.query(SELECT_COMMUNITY_BY_ID, [communityId]);
    if (rows.length === 0) {
        throw new Error(status.COMMUNITY_NOT_FOUND.message);
    }
    return rows[0];
};

// 사용자와 커뮤니티의 연결을 확인하는 쿼리
export const isUserInCommunityDao = async (communityId, userId) => {
    const [rows] = await pool.query(COUNT_USER_IN_COMMUNITY, [communityId, userId]);
    return rows[0].count > 0;
};

// 메시지 조회 (페이지네이션 추가)
export const fetchMessagesDao = async (communityId, limit, offset) => {
    const [rows] = await pool.query(GET_MESSAGES, [communityId, limit, offset]);
    return rows;
};

// 총 메시지 수 조회 (페이지네이션을 위한 추가 함수)
export const countMessagesDao = async (communityId) => {
    const [result] = await pool.query('SELECT COUNT(*) as count FROM MESSAGE WHERE community_id = ?', [communityId]);
    return result[0].count;
};

// 메시지 저장
export const saveMessageDao = async (communityId, userId, content) => {
    const [result] = await pool.query(INSERT_MESSAGE, [communityId, userId, content]);
    if (result.affectedRows === 0) throw new Error(status.MESSAGE_NOT_SENT.message);
    return result.insertId;
};

// 메시지 읽음 상태 저장
export const saveMessageReadStatusDao = async (messageId, userId) => {
    const [result] = await pool.query(INSERT_OR_UPDATE_MESSAGE_READ_STATUS, [messageId, userId]);
    if (result.affectedRows === 0) throw new Error(status.MESSAGE_READ_STATUS_NOT_UPDATED.message);
};

// 메시지 ID로 조회
export const fetchMessageByIdDao = async (messageId) => {
    const [rows] = await pool.query(SELECT_MESSAGE_BY_ID, [messageId]);
    if (rows.length === 0) {
        throw new Error(status.MESSAGE_NOT_FOUND.message);
    }
    return rows[0];
};
