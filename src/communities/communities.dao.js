// communities.dao.js
import { pool } from "../../config/db.config.js";
import { GET_COMMUNITY_CURRENT_COUNT, GET_COMMUNITY_CAPACITY, IS_USER_ALREADY_IN_COMMUNITY, JOIN_COMMUNITY } from './communities.sql.js';

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
