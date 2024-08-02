import { pool } from '../../config/db.config.js';
import { SEARCH_COMMUNITIES } from './communities.sql.js'; // 경로는 실제 위치에 맞게 조정

// 커뮤니티 검색
export const searchCommunities = async (query, size = 10, offset = 0) => {
    const formattedQuery = query.replace(/\s+/g, ''); // 모든 공백 제거

    const sql = SEARCH_COMMUNITIES;
    const values = [
        `%${formattedQuery}%`, `%${formattedQuery}%`, `%${formattedQuery}%`,
        size, offset
    ];

    try {
        const [results] = await pool.query(sql, values);
        return results;
    } catch (error) {
        console.error('Database query error:', error.message);
        throw new Error('Failed to search communities.');
    }
};
