import { pool } from '../../config/db.config.js';
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import { GET_COMMUNITIES, COUNT_COMMUNITIES } from './communities.sql.js';

// 모임 리스트 조회
export const getCommunities = async (page, size) => {
    const offset = (page - 1) * size;
    const limit = parseInt(size) + 1;  // 요청한 size보다 하나 더 조회
    const [rows] = await pool.query(GET_COMMUNITIES, [limit, parseInt(offset)]);
    const [countResult] = await pool.query(COUNT_COMMUNITIES);
    return { communities: rows, totalElements: countResult[0].count };
};

export const checkCommunityExistenceDao = async (community_id) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM COMMUNITY WHERE community_id = ? AND is_deleted = 0', [community_id]);

    conn.release();
    return rows[0].count > 0;
;}

export const checkCommunityOwnerDao = async (community_id) => {
    const conn = await pool.getConnection();
    
    const [result] = await conn.query('SELECT user_id FROM COMMUNITY WHERE community_id = ?', [community_id]);
    if (result.length === 0) {
        throw new BaseError(status.COMMUNITY_NOT_FOUND);
    }
    return result[0].user_id;
}


export const deleteCommunityDao = async (community_id) => {
    const conn = await pool.getConnection();

    await conn.query('UPDATE COMMUNITY SET is_deleted = 1 WHERE community_id = ?',[community_id]);
};