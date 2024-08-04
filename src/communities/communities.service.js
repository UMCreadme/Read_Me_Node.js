// communities.service.js
import { getCommunityCurrentCount, getCommunityCapacity, isUserAlreadyInCommunity, joinCommunity } from './communities.dao.js';
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';

// 커뮤니티 가입 서비스
export const joinCommunityService = async (joinCommunityDTO) => {
    const { community_id, user_id } = joinCommunityDTO;

    // 사용자가 이미 커뮤니티에 참여하고 있는지 확인
    const userInCommunity = await isUserAlreadyInCommunity(community_id, user_id);
    if (userInCommunity) {
        throw new BaseError(status.ALREADY_IN_COMMUNITY);
    }

    // 커뮤니티의 현재 참여자 수와 최대 인원수 조회
    const currentCount = await getCommunityCurrentCount(community_id);
    const capacity = await getCommunityCapacity(community_id);

    if (currentCount >= capacity) {
        throw new BaseError(status.COMMUNITY_FULL);
    }

    // 커뮤니티 가입 처리
    await joinCommunity(community_id, user_id);

    // 성공 시 별도의 반환값 없이 상태 코드만으로 처리
    return;
};
