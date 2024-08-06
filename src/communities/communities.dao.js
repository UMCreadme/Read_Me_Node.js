import { pool } from '../../config/db.config.js';
import {
    GET_COMMUNITY_CURRENT_COUNT,
    GET_COMMUNITY_CAPACITY,
    IS_USER_ALREADY_IN_COMMUNITY,
    JOIN_COMMUNITY,
    ADD_ADMIN_TO_COMMUNITY,
    COUNT_COMMUNITIES_BY_USER_AND_BOOK,
    CREATE_COMMUNITY,
    COUNT_COMMUNITIES,
    GET_COMMUNITIES,
    GET_COMMUNITIES_BY_TAG_KEYWORD,
    GET_COMMUNITIES_BY_TITLE_KEYWORD
} from './communities.sql.js';
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';

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


// 커뮤니티의 현재 참여자 수를 조회하는 함수
export const getCommunityCurrentCount = async (communityId) => {
    const [result] = await pool.query(GET_COMMUNITY_CURRENT_COUNT, [communityId]);
    return result[0].count;
};

// 커뮤니티의 최대 인원수를 조회하는 함수
export const getCommunityCapacity = async (communityId) => {
    const [result] = await pool.query(GET_COMMUNITY_CAPACITY, [communityId]);
    return result[0].capacity;
};

// 사용자가 이미 커뮤니티에 참여하고 있는지 확인하는 함수
export const isUserAlreadyInCommunity = async (communityId, userId) => {
    const [result] = await pool.query(IS_USER_ALREADY_IN_COMMUNITY, [communityId, userId]);
    return result[0].count > 0;
};

// 커뮤니티 가입 처리
export const joinCommunity = async (communityId, userId) => {
    await pool.query(JOIN_COMMUNITY, [communityId, userId]);
};

// 모임 리스트 조회
export const getCommunities = async (page, size) => {
    const offset = (page - 1) * size;
    const limit = parseInt(size) + 1;  // 요청한 size보다 하나 더 조회
    const [rows] = await pool.query(GET_COMMUNITIES, [limit, parseInt(offset)]);
    const [countResult] = await pool.query(COUNT_COMMUNITIES);
    return { communities: rows, totalElements: countResult[0].count };
};

// 제목으로 커뮤니티 검색
export const searchCommunitiesByTitleKeyword = async (keyword) => {
    try {
        const conn = await pool.getConnection();
        const [results] = await conn.query(GET_COMMUNITIES_BY_TITLE_KEYWORD, [keyword]);
        conn.release();
        return results;
    } catch (err) {
        console.error('Database query error:', err);
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }
};

// 태그로 커뮤니티 검색
export const searchCommunitiesByTagKeyword = async (keyword) => {
    try {
        const conn = await pool.getConnection();
        const [shortsTag] = await conn.query(GET_COMMUNITIES_BY_TAG_KEYWORD, [`%${keyword}%`]);
        conn.release();
        return shortsTag;
    } catch (err) {
        console.log(err);
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }
};