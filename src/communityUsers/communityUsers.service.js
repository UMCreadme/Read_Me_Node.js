import { joinCommunity } from './communityUsers.dao.js';

export const joinCommunityService = async (joinCommunityDTO) => {
    const { community_id, user_id } = joinCommunityDTO;

    try {
        const result = await joinCommunity(community_id, user_id);
        const joinedAt = new Date().toISOString(); // 참여 일자를 ISO 형식으로 생성

        return {
            groupId: parseInt(community_id, 10),
            userId: parseInt(user_id, 10),
            joinedAt
        };
    } catch (error) {
        // Error 메시지를 명확하게 전달
        throw new Error(`Service error: ${error.message}`);
    }
};
