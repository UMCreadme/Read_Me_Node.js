// communities.service.js
import { getCommunityCurrentCount, getCommunityCapacity, isUserAlreadyInCommunity, joinCommunity } from './communities.dao.js';
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';

// 커뮤니티 가입 서비스
export const joinCommunityService = async (communityId, userId) => { 
    const userInCommunity = await isUserAlreadyInCommunity(communityId, userId); 
    if (userInCommunity) {
        throw new BaseError(status.ALREADY_IN_COMMUNITY);
    }

    const currentCount = await getCommunityCurrentCount(communityId);
    const capacity = await getCommunityCapacity(communityId);

    if (currentCount >= capacity) {
        throw new BaseError(status.COMMUNITY_FULL);
    }

    await joinCommunity(communityId, userId);
};
