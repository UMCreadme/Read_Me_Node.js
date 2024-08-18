import { pool } from '../../config/db.config.js';
import {
    GET_MESSAGES,
    INSERT_MESSAGE,
    INSERT_OR_UPDATE_MESSAGE_READ_STATUS,
    SELECT_COMMUNITY_BY_ID,
    COUNT_USER_IN_COMMUNITY,
    SELECT_MESSAGE_BY_ID,
    COUNT_MESSAGES  
} from './chat.sql.js';
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';

export const fetchCommunityByIdDao = async (communityId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(SELECT_COMMUNITY_BY_ID, [communityId]);
        if (rows.length === 0) {
            throw new BaseError(status.COMMUNITY_NOT_FOUND);
        }
        return rows[0];
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

// 사용자와 커뮤니티의 연결을 확인하는 쿼리
export const isUserInCommunityDao = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(COUNT_USER_IN_COMMUNITY, [communityId, userId]);
        return rows[0].count > 0;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

// 메시지 조회 
export const fetchMessagesDao = async (communityId, limit, offset) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(GET_MESSAGES, [communityId, limit, offset]);
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

// 총 메시지 수 조회
export const countMessagesDao = async (communityId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(COUNT_MESSAGES, [communityId]);
        return result[0].count;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

// 메시지 저장
export const saveMessageDao = async (communityId, userId, content) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(INSERT_MESSAGE, [communityId, userId, content]);
        if (result.affectedRows === 0) throw new BaseError(status.MESSAGE_NOT_SENT);
        return result.insertId;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

// 메시지 읽음 상태 저장
export const saveMessageReadStatusDao = async (messageId, userId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(`
            SELECT community_id FROM MESSAGE WHERE message_id = ?;
        `, [messageId]);
        const communityId = result[0]?.community_id;

        if (!communityId) {
            throw new BaseError(status.COMMUNITY_NOT_FOUND);
        }

        const [insertResult] = await conn.query(INSERT_OR_UPDATE_MESSAGE_READ_STATUS, [messageId, userId, communityId]);
        if (insertResult.affectedRows === 0) throw new BaseError(status.MESSAGE_READ_STATUS_NOT_UPDATED);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

// 메시지 ID로 조회
export const fetchMessageByIdDao = async (messageId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(SELECT_MESSAGE_BY_ID, [messageId]);
        if (rows.length === 0) {
            throw new BaseError(status.MESSAGE_NOT_FOUND);
        }
        return rows[0];
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};
