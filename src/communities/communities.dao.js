import { pool } from '../../config/db.config.js';
import * as sql from "./communities.sql.js";
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';

// 커뮤니티 생성
export const createCommunity = async (community, bookId) => {
    const conn = await pool.getConnection();

    try {
        await conn.query('BEGIN'); // 트랜잭션 시작

        // 사용자가 특정 책으로 생성한 모임 수 조회
        const [countResult] = await conn.query(sql.COUNT_COMMUNITIES_BY_USER_AND_BOOK, [community.user_id, bookId]);
        const existingCount = countResult[0].count;

        // 한 사용자가 같은 책으로 5개 이상의 모임을 생성할 수 없도록 제한
        if (existingCount >= 5) {
            throw new BaseError(status.COMMUNITY_LIMIT_EXCEEDED);
        }

        // 커뮤니티 생성
        const [communityResult] = await conn.query(sql.CREATE_COMMUNITY, [community.user_id, bookId, community.content, community.location, community.tag, community.capacity] );
        const communityId = communityResult.insertId;

        // 방장을 커뮤니티에 추가
        await conn.query(sql.ADD_ADMIN_TO_COMMUNITY, [communityId, community.user_id]);

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
        if(conn) conn.release();
    }
    
};


// 커뮤니티의 현재 참여자 수를 조회하는 함수
export const getCommunityCurrentCount = async (communityId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.GET_COMMUNITY_CURRENT_COUNT, [communityId]);
        return result[0].count;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 커뮤니티의 최대 인원수를 조회하는 함수
export const getCommunityCapacity = async (communityId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.GET_COMMUNITY_CAPACITY, [communityId]);
        return result[0].capacity;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 사용자가 이미 커뮤니티에 참여하고 있는지 확인하는 함수
export const isUserAlreadyInCommunity = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.IS_USER_ALREADY_IN_COMMUNITY, [communityId, userId]);
        return result[0].count > 0;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 커뮤니티 가입 처리
export const joinCommunity = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(sql.JOIN_COMMUNITY, [communityId, userId]);
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 모임 리스트 조회
export const getCommunities = async (offset, limit) => {
    const conn = await pool.getConnection();
    try{
        const [communities] = await conn.query(sql.GET_COMMUNITIES, [limit, offset]);
        
        return communities;
    }catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 나의 참여 모임 리스트 조회
export const getMyCommunities = async (myId, offset, limit) => {
    const conn = await pool.getConnection();
    try {
        const [communities] = await conn.query(sql.getMyCommunities, [myId, limit, offset]);

        return communities;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 커뮤니티 책 제목, 표지 불러오기
export const getCommunityBookInfo = async (communityId) => {
    const conn = await pool.getConnection();
    try {
        // 모임에서 선택된 책 id 불러오기
        const [bookIdResult] = await conn.query(sql.getCommunityBookID, [communityId]);
        const bookId = bookIdResult[0].book_id;

        // 해당 책의 표지와 제목 불러오기
        const [result] = await conn.query(sql.getBookInfo, [bookId]);

        return result[0]
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 안읽은 메시지 개수 
export const getUnreadCnt = async (communityId, myId) => {
    const conn = await pool.getConnection();
    try {
        const [result] =  await conn.query(sql.getUnreadCount, [myId, communityId])
        return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
}