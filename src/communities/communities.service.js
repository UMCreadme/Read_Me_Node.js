import { createCommunity, addAdminToCommunity } from './communities.dao.js';
import { createCommunityDto } from './communities.dto.js';
import { getCommunities } from './communities.dao.js';
import { getCommunitiesDto } from './communities.dto.js';

// 커뮤니티 생성
export const createCommunityService = async (userId, bookId, address, tag, capacity) => {

    const communityId = await createCommunity(userId, bookId, address, tag, capacity);
    // 방장을 커뮤니티에 추가
    await addAdminToCommunity(communityId, userId);

    return createCommunityDto({
        communityId,
        userId,
        bookId,
        address,
        tag,
        capacity
    });
}


// 전체 모임 리스트 조회
export const getCommunitiesService = async (page, size) => {
    const communities = await getCommunities(page, size);
    return getCommunitiesDto(communities, page, size);
};
