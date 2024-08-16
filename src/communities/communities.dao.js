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
        throw err;
    } finally {
        if(conn) conn.release(); // 연결 해제
    }
};

// 커뮤니티의 현재 참여자 수를 조회하는 함수
export const getCommunityCurrentCount = async (communityId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(GET_COMMUNITY_CURRENT_COUNT, [communityId]);
        return result[0].count;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release(); // 연결 해제
    }
};

// 커뮤니티의 최대 인원수를 조회하는 함수
export const getCommunityCapacity = async (communityId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(GET_COMMUNITY_CAPACITY, [communityId]);
        return result[0].capacity;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release(); // 연결 해제
    }
};

// 사용자가 이미 커뮤니티에 참여하고 있는지 확인하는 함수
export const isUserAlreadyInCommunity = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(IS_USER_ALREADY_IN_COMMUNITY, [communityId, userId]);
        return result[0].count > 0;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release(); // 연결 해제
    }
};

// 커뮤니티 가입 처리
export const joinCommunity = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(JOIN_COMMUNITY, [communityId, userId]);
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release(); // 연결 해제
    }
};

// 모임 리스트 조회
export const getCommunities = async (page, size) => {
    const conn = await pool.getConnection();
    try {
        const offset = (page - 1) * size;
        const limit = parseInt(size) + 1;  // 요청한 size보다 하나 더 조회
        const [rows] = await conn.query(GET_COMMUNITIES, [limit, parseInt(offset)]);
        const [countResult] = await conn.query(COUNT_COMMUNITIES);
        return { communities: rows, totalElements: countResult[0].count };
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release(); // 연결 해제
    }
};

// 제목으로 커뮤니티 검색
export const searchCommunitiesByTitleKeyword = async (keyword) => {
    const conn = await pool.getConnection();
    try {
        const [results] = await conn.query(GET_COMMUNITIES_BY_TITLE_KEYWORD, [keyword]);
        return results;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (conn) conn.release(); // conn이 정의되어 있을 때만 release를 호출합니다.
    }
};

// 태그로 커뮤니티 검색
export const searchCommunitiesByTagKeyword = async (keyword) => {
    const conn = await pool.getConnection()
    try {
        const [shortsTag] = await conn.query(GET_COMMUNITIES_BY_TAG_KEYWORD, [`%${keyword}%`]);
        return shortsTag;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (conn) conn.release();
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

    try {
        await conn.query('BEGIN');

        // 커뮤니티 소프트 딜리트
        await conn.query('UPDATE COMMUNITY SET is_deleted = 1 WHERE community_id = ?',[community_id]);
        
        // 커뮤니티 참가자 소프트 딜리트
        await conn.query('UPDATE COMMUNITY_USERS SET is_deleted = 1 WHERE community_id = ?', [community_id]);

        // 트랜잭션 커밋
        await conn.query('COMMIT');
    } catch (err) {
        await conn.query('ROLLBACK');
        throw err;
    } finally {
        if(conn) conn.release();
    }

};