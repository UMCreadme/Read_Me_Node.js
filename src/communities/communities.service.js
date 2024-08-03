import { joinCommunity } from './communities.dao.js';

export const joinCommunityService = async (joinCommunityDTO) => {
    const { community_id, user_id } = joinCommunityDTO;

    try {
        // 현재 UTC 시간을 기준으로 한국 시간(KST)으로 변환
        const now = new Date();
        now.setHours(now.getUTCHours() + 9);  // UTC 시간에 9시간 더해 한국 시간으로 설정

        // toISOString() 대신 toLocaleString()을 사용하여 KST 형식으로 변환
        const joinedAt = now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

        const result = await joinCommunity(community_id, user_id);

        return {
            communityId: parseInt(community_id, 10),
            userId: parseInt(user_id, 10),
            joinedAt
        };
    } catch (error) {
        // Error 메시지를 명확하게 전달
        throw new Error(`Service error: ${error.message}`);
    }
};
