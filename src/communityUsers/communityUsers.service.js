import { joinCommunity } from './communityUsers.dao.js';

export const joinCommunityService = async (joinCommunityDTO) => {
    const { community_id, user_id } = joinCommunityDTO;

    try {
        const result = await joinCommunity(community_id, user_id);
        return {
            community_id,
            user_id,
            result
        };
    } catch (error) {
        // Error 메시지를 명확하게 전달
        throw new Error(`Service error: ${error.message}`);
    }
};
