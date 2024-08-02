// communityUsers.dao.js
import { pool } from "../../config/db.config.js";
import { GET_COMMUNITY_CURRENT_COUNT, GET_COMMUNITY_CAPACITY, IS_USER_ALREADY_IN_COMMUNITY, JOIN_COMMUNITY } from './communities.sql.js';

// 커뮤니티의 현재 참여자 수를 조회하는 함수
const getCommunityCurrentCount = async (community_id) => {
    const [result] = await pool.query(GET_COMMUNITY_CURRENT_COUNT, [community_id]);
    return result[0].count;
};

// 커뮤니티의 최대 인원수를 조회하는 함수
const getCommunityCapacity = async (community_id) => {
    const [result] = await pool.query(GET_COMMUNITY_CAPACITY, [community_id]);
    return result[0].capacity;
};

// 사용자가 이미 커뮤니티에 참여하고 있는지 확인하는 함수
const isUserAlreadyInCommunity = async (community_id, user_id) => {
    const [result] = await pool.query(IS_USER_ALREADY_IN_COMMUNITY, [community_id, user_id]);
    return result[0].count > 0;
};

export const joinCommunity = async (community_id, user_id) => {
    try {
        if (await isUserAlreadyInCommunity(community_id, user_id)) {
            throw new Error('User already in the community');
        }

        const currentCount = await getCommunityCurrentCount(community_id);
        const capacity = await getCommunityCapacity(community_id);

        if (currentCount >= capacity) {
            throw new Error('Community has reached its capacity');
        }

        const [result] = await pool.query(JOIN_COMMUNITY, [community_id, user_id]);
        return result;

    } catch (error) {
        throw new Error(`DAO error: ${error.message}`);
    }
};
