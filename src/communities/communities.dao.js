import { pool } from '../../config/db.config.js';
import {
    GET_COMMUNITY_CURRENT_COUNT,
    GET_COMMUNITY_CAPACITY,
    JOIN_COMMUNITY,
    ADD_ADMIN_TO_COMMUNITY,
    COUNT_COMMUNITIES_BY_USER_AND_BOOK,
    CREATE_COMMUNITY,
    CHECK_IF_LEADER,
    LEAVE_COMMUNITY,
    CHECK_USER_IN_COMMUNITY,
    REJOIN_COMMUNITY,
    GET_COMMUNITY_DETAILS,
    GET_CHATROOM_DETAILS,
    GET_CHATROOM_MEMBERS,
    SET_MEETING_DETAILS,
    GET_COMMUNITY_UPDATED_AT,
    CHECK_USER_PARTICIPATION_QUERY,
    COUNT_COMMUNITIES,
    GET_COMMUNITIES,
    GET_COMMUNITIES_BY_TAG_KEYWORD,
    GET_COMMUNITIES_BY_TITLE_KEYWORD,
    CHECK_COMMUNITY_EXISTENCE
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
        if (conn) conn.release(); // 연결 해제
    }
};

// 커뮤니티에 재가입하는 함수 (소프트 딜리트 취소)
export const rejoinCommunity = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(REJOIN_COMMUNITY, [communityId, userId]);
    } finally {
        if (conn) conn.release();
    }
};

// 커뮤니티에 새로 가입하는 함수
export const joinCommunity = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(JOIN_COMMUNITY, [communityId, userId]);
    } finally {
        if (conn) conn.release();
    }
};


// 커뮤니티의 현재 참여자 수 조회 (탈퇴하지 않은 유저만 카운트)
export const getCommunityCurrentCountDao = async (communityId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(GET_COMMUNITY_CURRENT_COUNT, [communityId]);
        return result[0].count;
    } finally {
        if (conn) conn.release();
    }
};

// 유저가 방장인지 확인하는 함수
export const checkIfLeaderDao = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(CHECK_IF_LEADER, [communityId, userId]);
        return result.length > 0 && result[0].role === 'admin';
    } finally {
        if (conn) conn.release();
    }
};

// 커뮤니티 탈퇴 처리 (소프트 딜리트)
export const leaveCommunityDao = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        await conn.query(LEAVE_COMMUNITY, [communityId, userId]);
    } finally {
        if (conn) conn.release();
    }
};

// 유저가 커뮤니티에 이미 존재하는지 확인하고, is_deleted 상태를 반환하는 함수
export const checkUserInCommunity = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(CHECK_USER_IN_COMMUNITY, [communityId, userId]);
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
        const [result] = await conn.query(GET_COMMUNITY_CAPACITY, [communityId]);
        return result[0].capacity;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (conn) conn.release();
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
        if (conn) conn.release(); // 연결 해제
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
    try {
        const [rows] = await conn.query(CHECK_COMMUNITY_EXISTENCE, [community_id]);
        return rows[0].count > 0;
    } finally {
        conn.release();
    }
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
        const [rows] = await conn.query(GET_COMMUNITY_DETAILS, [communityId]);
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

// 커뮤니티에 유저가 참여 중인지 확인하는 DAO 메서드
export const checkUserParticipationInCommunityDao = async (communityId, userId) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(CHECK_USER_PARTICIPATION_QUERY,
            [communityId, userId]
        );
        return result[0].count > 0;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

export const getChatroomDetailsDao = async (communityId) => {
    const conn = await pool.getConnection();
    try {
        const [communityData] = await conn.query(GET_CHATROOM_DETAILS, [communityId]);
        const [membersData] = await conn.query(GET_CHATROOM_MEMBERS, [communityId]);

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
        console.log('Executing query for communityId:', communityId);
        const [result] = await conn.query(SET_MEETING_DETAILS, [
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
        const [result] = await conn.query(GET_COMMUNITY_UPDATED_AT, [communityId]);
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