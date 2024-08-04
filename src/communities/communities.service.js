// communities.service.js
import { joinCommunity } from './communities.dao.js';


export const joinCommunityService = async (joinCommunityDTO) => {
    const { community_id, user_id } = joinCommunityDTO;

    // 커뮤니티 가입 처리
    await joinCommunity(community_id, user_id);
    
    // 성공 시 별도의 반환값 없이 상태 코드만으로 처리!
    return;
};
