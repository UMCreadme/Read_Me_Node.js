import { pool } from '../../config/db.config.js';
import { GET_COMMUNITIES, COUNT_COMMUNITIES } from './communities.sql.js';

// 커뮤니티 검색
export const searchCommunities = async (query, size, offset) => {
    const formattedQuery = query.replace(/\s+/g, ''); // 모든 공백 제거
    const sql = `
        SELECT 
            c.community_id AS communityId,
            c.user_id AS userId,
            c.book_id AS bookId,
            c.address,
            c.tag AS tags,
            c.capacity,
            c.created_at AS createdAt,
            c.updated_at AS updatedAt,
            (
                (CASE WHEN REPLACE(c.address, ' ', '') LIKE ? THEN 1 ELSE 0 END) +
                (CASE WHEN REPLACE(c.tag, ' ', '') LIKE ? THEN 1 ELSE 0 END) +
                (CASE WHEN REPLACE(b.title, ' ', '') LIKE ? THEN 1 ELSE 0 END)
            ) AS relevance
        FROM COMMUNITY c
        JOIN BOOK b ON c.book_id = b.book_id
        WHERE REPLACE(c.address, ' ', '') LIKE ?
           OR REPLACE(c.tag, ' ', '') LIKE ?
           OR REPLACE(b.title, ' ', '') LIKE ?
        ORDER BY relevance DESC, c.created_at DESC
        LIMIT ? OFFSET ?
    `;
    const values = [
        `%${formattedQuery}%`, `%${formattedQuery}%`, `%${formattedQuery}%`, 
        `%${formattedQuery}%`, `%${formattedQuery}%`, `%${formattedQuery}%`,
        size, offset
    ];
    const [results] = await pool.query(sql, values);
    return results;
};

// 모임 리스트 조회
export const getCommunities = async (page, size) => {
    const offset = (page - 1) * size;
    const limit = parseInt(size) + 1;  // 요청한 size보다 하나 더 조회
    const [rows] = await pool.query(GET_COMMUNITIES, [limit, parseInt(offset)]);
    const [countResult] = await pool.query(COUNT_COMMUNITIES);
    return { communities: rows, totalElements: countResult[0].count };
};
