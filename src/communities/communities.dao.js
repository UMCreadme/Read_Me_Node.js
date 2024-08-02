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

import { GET_COMMUNITIES, COUNT_COMMUNITIES } from './communities.sql.js';

// 모임 리스트 조회
export const getCommunities = async (page, size) => {
    const offset = (page - 1) * size;
    const limit = parseInt(size) + 1;  // 요청한 size보다 하나 더 조회
    const [rows] = await pool.query(GET_COMMUNITIES, [limit, parseInt(offset)]);
    const [countResult] = await pool.query(COUNT_COMMUNITIES);
    return { communities: rows, totalElements: countResult[0].count };

};
