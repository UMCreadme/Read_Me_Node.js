import { pool } from '../../config/db.config.js';
import * as sql from "./communities.sql.js";
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import { insertObject } from '../common/common.dao.js';

// 커뮤니티 생성
export const createCommunity = async (community) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('BEGIN');

        const communityId = await insertObject(conn, "COMMUNITY", community);

        // 방장을 커뮤니티에 추가
        await conn.query(sql.ADD_ADMIN_TO_COMMUNITY, [communityId, community.user_id]);

        await conn.query('COMMIT'); // 트랜잭션 커밋
        return communityId;
    } catch (err) {
        await conn.query('ROLLBACK'); // 트랜잭션 롤백
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 사용자가 모임 생성 가능한지 확인 (동일 책으로 5권 생성)
export const isPossibleCreateCommunity = async (userId, bookId) => {
    const conn = await pool.getConnection();
    try {
        // 사용자가 특정 책으로 생성한 모임 수 조회
        const [countResult] = await conn.query(sql.COUNT_COMMUNITIES_BY_USER_AND_BOOK, [userId, bookId]);
        const existingCount = countResult[0].count;

        // 한 사용자가 같은 책으로 5개 이상의 모임을 생성할 수 없도록 제한
        return existingCount < 5;
    } catch (err) {
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 커뮤니티에 재가입하는 함수 (소프트 딜리트 취소)
export const rejoinCommunity = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(sql.REJOIN_COMMUNITY, [communityId, userId]);
    } finally {
        if (conn) conn.release();
    }
};

// 커뮤니티에 새로 가입하는 함수
export const joinCommunity = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(sql.JOIN_COMMUNITY, [communityId, userId]);
    } finally {
        if (conn) conn.release();
    }
};

// 커뮤니티의 현재 참여자 수를 조회하는 함수 (탈퇴하지 않은 유저만 카운트)
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


// 유저가 방장인지 확인하는 함수
export const checkIfLeaderDao = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.CHECK_IF_LEADER, [communityId, userId]);
        return result.length > 0 && result[0].role === 'admin';
    } finally {
        if (conn) conn.release();
    }
};

// 커뮤니티 탈퇴
export const leaveCommunityDao = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(sql.LEAVE_COMMUNITY, [communityId, userId]);
    } finally {
        if (conn) conn.release();
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

// 유저가 커뮤니티에 이미 존재하는지 확인하고, is_deleted 상태를 반환하는 함수
export const checkUserInCommunity = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(sql.CHECK_USER_IN_COMMUNITY, [communityId, userId]);
        // 유저가 존재하지 않으면 null, 존재하면 is_deleted 상태 반환
        return rows.length > 0 ? rows[0].is_deleted : null;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
};

// 커뮤니티의 최대 인원수를 조회하는 함수
export const getCommunityCapacityDao = async (communityId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.GET_COMMUNITY_CAPACITY, [communityId]);
        return result[0].capacity;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (conn) conn.release();
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

// 전체 모임 리스트 조회
export const getCommunities = async (offset, limit) => {
    const conn = await pool.getConnection();
    try {
        const [communities] = await conn.query(sql.getCommunities, [limit, offset]);
        return communities;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

// 나의 참여 모임 리스트 조회
export const getMyCommunities = async (myId, offset, limit) => {
    const conn = await pool.getConnection();
    try {
        const [communities] = await conn.query(sql.getMyCommunities, [myId, myId, limit, offset]);
        return communities;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if(conn) conn.release();
    }
};

// 제목으로 커뮤니티 검색
export const searchCommunitiesByTitleKeyword = async (keyword, offset, limit) => {
    const conn = await pool.getConnection();
    try {
        const [results] = await conn.query(sql.GET_COMMUNITIES_BY_TITLE_KEYWORD, [keyword, limit, offset ]);
        return results;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

// 태그로 커뮤니티 검색
export const searchCommunitiesByTagKeyword = async (keyword, offset, limit) => {
    const conn = await pool.getConnection()
    try {
        const [shortsTag] = await conn.query(sql.GET_COMMUNITIES_BY_TAG_KEYWORD, [`%${keyword}%`, limit, offset ]);
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
    try {
        const [rows] = await conn.query(sql.CHECK_COMMUNITY_EXISTENCE, [community_id]);
        return rows[0].count > 0;
    } finally {
        if (conn) conn.release();
    }
};

export const checkCommunityOwnerDao = async (community_id) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query('SELECT user_id FROM COMMUNITY WHERE community_id = ?', [community_id]);
        if (result.length === 0) {
            throw new BaseError(status.COMMUNITY_NOT_FOUND);
        }
        return result[0].user_id;
    } finally {
        if (conn) conn.release();
    }
};


export const deleteCommunityDao = async (community_id) => {
    const conn = await pool.getConnection();

    try {
        await conn.query('BEGIN');

        // 커뮤니티 소프트 딜리트
        await conn.query('UPDATE COMMUNITY SET is_deleted = 1 WHERE community_id = ?', [community_id]);

        // 커뮤니티 참가자 소프트 딜리트
        await conn.query('UPDATE COMMUNITY_USERS SET is_deleted = 1 WHERE community_id = ?', [community_id]);

        // 트랜잭션 커밋
        await conn.query('COMMIT');
    } catch (err) {
        await conn.query('ROLLBACK');
        throw err;
    } finally {
        if (conn) conn.release();
    }

};

// 커뮤니티 상세정보를 조회하는 DAO 함수
export const getCommunityDetailsDao = async (communityId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(sql.GET_COMMUNITY_DETAILS, [communityId]);
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

export const getChatroomDetailsDao = async (communityId) => {
    const conn = await pool.getConnection();
    try {
        const [communityData] = await conn.query(sql.GET_CHATROOM_DETAILS, [communityId]);
        const [membersData] = await conn.query(sql.GET_CHATROOM_MEMBERS, [communityId]);

        return { communityData, membersData };
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

// 약속 설정 DAO
export const updateMeetingDetailsDao = async (communityId, meetingDate, latitude, longitude, address, userId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.SET_MEETING_DETAILS, [
            meetingDate,
            `POINT(${latitude} ${longitude})`,
            address,
            communityId,
            userId,
        ]);

        return result;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

// 커뮤니티의 마지막 업데이트 시간을 가져옴
export const getCommunityUpdatedAtDao = async (communityId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(sql.GET_COMMUNITY_UPDATED_AT, [communityId]);
        if (result.length === 0) {
            throw new BaseError(status.COMMUNITY_NOT_FOUND);
        }
        return result[0].updated_at;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
};