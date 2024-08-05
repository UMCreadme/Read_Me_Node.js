import { pool } from '../../config/db.config.js';
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import { GET_COMMUNITIES, COUNT_COMMUNITIES } from './communities.sql.js';
import { CREATE_COMMUNITY, ADD_ADMIN_TO_COMMUNITY, COUNT_COMMUNITIES_BY_USER_AND_BOOK } from './communities.sql.js';

// 모임 리스트 조회
export const getCommunities = async (page, size) => {
    const offset = (page - 1) * size;
    const limit = parseInt(size) + 1;  // 요청한 size보다 하나 더 조회
    const [rows] = await pool.query(GET_COMMUNITIES, [limit, parseInt(offset)]);
    const [countResult] = await pool.query(COUNT_COMMUNITIES);
    return { communities: rows, totalElements: countResult[0].count };
}
  
// 커뮤니티 생성과 관련된 전체 과정 처리
export const createCommunityWithCheck = async (userId, bookId, address, tag, capacity) => {
    const conn = await pool.getConnection();

    try {
        await conn.query('BEGIN'); // 트랜잭션 시작

        // 사용자가 특정 책으로 생성한 모임 수 조회
        const [countResult] = await conn.query(COUNT_COMMUNITIES_BY_USER_AND_BOOK, [userId, bookId]);
        const existingCount = countResult[0].count;

        // 한 사용자가 같은 책으로 5개 이상의 모임을 생성할 수 없도록 제한
        if (existingCount >= 5) {
            throw new BaseError(status.COMMUNITY_LIMIT_EXCEEDED);
        }

        // 커뮤니티 생성
        const [communityResult] = await conn.query(CREATE_COMMUNITY, [userId, bookId, address, tag, capacity]);
        const communityId = communityResult.insertId;

        // 방장을 커뮤니티에 추가
        await conn.query(ADD_ADMIN_TO_COMMUNITY, [communityId, userId]);

        await conn.query('COMMIT'); // 트랜잭션 커밋
        return communityId;
    } catch (err) {
        await conn.query('ROLLBACK'); // 트랜잭션 롤백
        console.error(err); // 에러 로그 출력

        if (err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    } finally {
        console.log('finally');
        conn.release(); // 연결 해제
    }

};

export const checkCommunityExistenceDao = async (community_id) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM COMMUNITY WHERE community_id = ? AND is_deleted = 0', [community_id]);

    conn.release();
    return rows[0].count > 0;
};

export const checkCommunityOwnerDao = async (community_id) => {
    const conn = await pool.getConnection();
    
    const [result] = await conn.query('SELECT user_id FROM COMMUNITY WHERE community_id = ?', [community_id]);
    if (result.length === 0) {
        throw new BaseError(status.COMMUNITY_NOT_FOUND);
    }
    return result[0].user_id;
};


export const deleteCommunityDao = async (community_id) => {
    const conn = await pool.getConnection();

    await conn.query('UPDATE COMMUNITY SET is_deleted = 1 WHERE community_id = ?',[community_id]);
};