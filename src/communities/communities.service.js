// src/communities/communities.service.js
import { pool } from '../../config/db.config.js';
import { createCommunityDto } from './communities.dto.js';
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import { CREATE_COMMUNITY, ADD_ADMIN_TO_COMMUNITY, COUNT_COMMUNITIES_BY_USER_AND_BOOK } from './communities.sql.js';

// 특정 사용자가 특정 책으로 생성한 모임 수를 조회하는 함수
const countCommunitiesByUserAndBook = async (userId, bookId) => {
    const [result] = await pool.query(COUNT_COMMUNITIES_BY_USER_AND_BOOK, [userId, bookId]);
    return result[0].count;
};

// 커뮤니티 생성 서비스
export const createCommunityService = async (userId, bookId, address, tag, capacity) => {
    const conn = await pool.getConnection();

    try {
        // 사용자가 특정 책으로 생성한 모임 수 조회
        const existingCount = await countCommunitiesByUserAndBook(userId, bookId);

        // 한 사용자가 같은 책으로 5개 이상의 모임을 생성할 수 없도록 제한
        if (existingCount >= 5) {
            // 새로운 에러 상태 코드 사용
            throw new BaseError(status.COMMUNITY_LIMIT_EXCEEDED);
        }

        await conn.beginTransaction(); // 트랜잭션 시작

        // 커뮤니티 생성
        const [communityResult] = await conn.query(CREATE_COMMUNITY, [userId, bookId, address, tag, capacity]);
        const communityId = communityResult.insertId;

        // 방장을 커뮤니티에 추가
        await conn.query(ADD_ADMIN_TO_COMMUNITY, [communityId, userId]);

        await conn.commit(); // 트랜잭션 커밋
        conn.release();

        return createCommunityDto({
            communityId,
            userId,
            bookId,
            address,
            tag,
            capacity
        });
    } catch (err) {
        await conn.rollback(); // 트랜잭션 롤백
        conn.release();

        console.error(err);
        if (err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};
