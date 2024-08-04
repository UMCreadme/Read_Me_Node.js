// communities.dao.js
import { pool } from "../../config/db.config.js";
import { GET_COMMUNITY_CURRENT_COUNT, GET_COMMUNITY_CAPACITY, IS_USER_ALREADY_IN_COMMUNITY, JOIN_COMMUNITY } from './communities.sql.js';

// 커뮤니티의 현재 참여자 수를 조회하는 함수
export const getCommunityCurrentCount = async (community_id) => {
    const [result] = await pool.query(GET_COMMUNITY_CURRENT_COUNT, [community_id]);
    return result[0].count;
};

// 커뮤니티의 최대 인원수를 조회하는 함수
export const getCommunityCapacity = async (community_id) => {
    const [result] = await pool.query(GET_COMMUNITY_CAPACITY, [community_id]);
    return result[0].capacity;
};

// 사용자가 이미 커뮤니티에 참여하고 있는지 확인하는 함수
export const isUserAlreadyInCommunity = async (community_id, user_id) => {
    const [result] = await pool.query(IS_USER_ALREADY_IN_COMMUNITY, [community_id, user_id]);
    return result[0].count > 0;
};

// 커뮤니티 가입 처리
export const joinCommunity = async (community_id, user_id) => {
    await pool.query(JOIN_COMMUNITY, [community_id, user_id]);
};
