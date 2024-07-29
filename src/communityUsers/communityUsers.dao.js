import { pool } from "../../config/db.config.js";

// 커뮤니티의 현재 참여자 수를 조회하는 함수
const getCommunityCurrentCount = async (community_id) => {
    const query = 'SELECT COUNT(*) AS count FROM COMMUNITY_USERS WHERE community_id = ?';
    const values = [community_id];
    const [result] = await pool.query(query, values);
    return result[0].count;
};

// 커뮤니티의 최대 인원수를 조회하는 함수
const getCommunityCapacity = async (community_id) => {
    const query = 'SELECT capacity FROM COMMUNITY WHERE community_id = ?';
    const values = [community_id];
    const [result] = await pool.query(query, values);
    return result[0].capacity;
};

// 사용자가 이미 커뮤니티에 참여하고 있는지 확인하는 함수
const isUserAlreadyInCommunity = async (community_id, user_id) => {
    const query = 'SELECT COUNT(*) AS count FROM COMMUNITY_USERS WHERE community_id = ? AND user_id = ?';
    const values = [community_id, user_id];
    const [result] = await pool.query(query, values);
    return result[0].count > 0;
};

export const joinCommunity = async (community_id, user_id) => {
    try {
        // Check if user is already in the community
        if (await isUserAlreadyInCommunity(community_id, user_id)) {
            throw new Error('User already in the community');
        }

        // Check if community has reached its capacity
        const currentCount = await getCommunityCurrentCount(community_id);
        const capacity = await getCommunityCapacity(community_id);

        if (currentCount >= capacity) {
            throw new Error('Community has reached its capacity');
        }

        const query = 'INSERT INTO COMMUNITY_USERS (community_id, user_id) VALUES (?, ?)';
        const values = [community_id, user_id];
        const [result] = await pool.query(query, values);
        return result;

    } catch (error) {
        throw new Error(`DAO error: ${error.message}`);
    }
};
