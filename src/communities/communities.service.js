import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import { getCommunities, deleteCommunityDao, 
    checkCommunityExistenceDao, checkCommunityOwnerDao } from './communities.dao.js';
import { getCommunitiesDto } from './communities.dto.js';

// 전체 모임 리스트 조회
export const getCommunitiesService = async (page, size) => {
    const communities = await getCommunities(page, size);
    return getCommunitiesDto(communities, page, size);
};

export const deleteCommunityService = async (user_id, community_id) => {
    const exists = await checkCommunityExistenceDao(community_id);
    if (!exists) {
        throw new BaseError(status.COMMUNITY_NOT_FOUND);
    }

    const owner = await checkCommunityOwnerDao(community_id);
    if ( owner !== user_id) {
        throw new BaseError(status.UNAUTHORIZED);
    }

    await deleteCommunityDao(community_id);
}