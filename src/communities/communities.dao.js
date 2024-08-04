import { pool } from '../../config/db.config.js';
import { CREATE_COMMUNITY, ADD_ADMIN_TO_COMMUNITY, COUNT_COMMUNITIES_BY_USER_AND_BOOK } from './communities.sql.js';
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';

// 특정 사용자가 특정 책으로 생성한 모임 수를 조회
export const countCommunitiesByUserAndBook = async (userId, bookId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(COUNT_COMMUNITIES_BY_USER_AND_BOOK, [userId, bookId]);
        return result[0].count;
    } finally {
        conn.release(); // 연결 해제
    }
};

// 커뮤니티 생성
export const createCommunity = async (conn, userId, bookId, address, tag, capacity) => {
    try {
        const [result] = await conn.query(CREATE_COMMUNITY, [userId, bookId, address, tag, capacity]);
        return result.insertId;
    } catch (err) {
        throw err; // 에러를 상위로 전파
    }
};

// 방장을 커뮤니티에 추가하는 함수
export const addAdminToCommunity = async (conn, communityId, userId) => {
    try {
        await conn.query(ADD_ADMIN_TO_COMMUNITY, [communityId, userId]);
    } catch (err) {
        throw err; // 에러를 상위로 전파
    }
};

// 커뮤니티 생성과 관련된 전체 과정 처리
export const createCommunityWithCheck = async (userId, bookId, address, tag, capacity) => {
    const conn = await pool.getConnection();
    try {
        // 사용자가 특정 책으로 생성한 모임 수 조회
        const existingCount = await countCommunitiesByUserAndBook(userId, bookId);

        // 한 사용자가 같은 책으로 5개 이상의 모임을 생성할 수 없도록 제한
        if (existingCount >= 5) {
            throw new BaseError(status.COMMUNITY_LIMIT_EXCEEDED, `한 사용자가 같은 책으로 5개 이상의 모임을 생성할 수 없습니다. 이미 생성된 모임 수: ${existingCount}`);
        }

        await conn.beginTransaction(); // 트랜잭션 시작

        // 커뮤니티 생성
        const communityId = await createCommunity(conn, userId, bookId, address, tag, capacity);

        // 방장을 커뮤니티에 추가
        await addAdminToCommunity(conn, communityId, userId);

        await conn.commit(); // 트랜잭션 커밋
        return communityId;
    } catch (err) {
        await conn.rollback(); // 트랜잭션 롤백
        throw err; // 에러를 상위로 전파
    } finally {
        conn.release(); // 연결 해제
    }
};
