import { pool } from '../../config/db.config.js';
import { GET_COMMUNITIES, COUNT_COMMUNITIES } from './communities.sql.js';

// 모임 리스트 조회
export const getCommunities = async (page, size) => {
    const offset = (page - 1) * size;
    const limit = parseInt(size) + 1;  // 요청한 size보다 하나 더 조회
    const [rows] = await pool.query(GET_COMMUNITIES, [limit, parseInt(offset)]);
    const [countResult] = await pool.query(COUNT_COMMUNITIES);
    return { communities: rows, totalElements: countResult[0].count };
};
