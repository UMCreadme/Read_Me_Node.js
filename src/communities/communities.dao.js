// communities.dao.js
import { pool } from '../../config/db.config.js';
import { CREATE_COMMUNITY, ADD_ADMIN_TO_COMMUNITY, COUNT_COMMUNITIES_BY_USER_AND_BOOK } from './communities.sql.js';

// 커뮤니티 생성
export const createCommunity = async (userId, bookId, address, tag, capacity) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction(); // 트랜잭션 시작

        // 커뮤니티 생성
        const [result] = await conn.query(CREATE_COMMUNITY, [userId, bookId, address, tag, capacity]);
        const communityId = result.insertId;

        await conn.commit(); // 트랜잭션 커밋
        return communityId;
    } catch (err) {
        await conn.rollback(); // 트랜잭션 롤백
        console.error(err);
        throw err; // 에러를 상위로 전파
    } finally {
        conn.release(); // 연결 해제
    }
};

// 특정 사용자가 특정 책으로 생성한 모임 수를 조회
export const countCommunitiesByUserAndBook = async (userId, bookId) => {
    const [result] = await pool.query(COUNT_COMMUNITIES_BY_USER_AND_BOOK, [userId, bookId]);
    return result[0].count;
};

// 방장을 커뮤니티에 추가하는 함수
export const addAdminToCommunity = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction(); // 트랜잭션 시작

        // 방장 정보를 COMMUNITY_USERS 테이블에 추가
        const [result] = await conn.query(ADD_ADMIN_TO_COMMUNITY, [communityId, userId]);

        await conn.commit(); // 트랜잭션 커밋
        return result;
    } catch (err) {
        await conn.rollback(); // 트랜잭션 롤백
        console.error(err);
        throw err; // 에러를 상위로 전파
    } finally {
        conn.release(); // 연결 해제
    }
};
