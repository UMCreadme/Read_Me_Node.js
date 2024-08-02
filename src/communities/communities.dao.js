import { pool } from '../../config/db.config.js';

// 커뮤니티 생성
export const createCommunity = async (userId, bookId, address, tag, capacity) => {
    const [result] = await pool.query(
        "INSERT INTO COMMUNITY (user_id, book_id, address, tag, capacity) VALUES (?, ?, ?, ?, ?)",
        [userId, bookId, address, tag, capacity]
    );
    return result.insertId;
};

// 방장을 커뮤니티에 추가하는 함수
export const addAdminToCommunity = async (communityId, userId) => {
    const query = 'INSERT INTO COMMUNITY_USERS (community_id, user_id, role) VALUES (?, ?, ?)';
    const values = [communityId, userId, 'admin'];
    const [result] = await pool.query(query, values);
    return result;
};
