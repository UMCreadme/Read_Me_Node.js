import { getCommunities } from './communities.dao.js';
import { getCommunitiesDto } from './communities.dto.js';

// 전체 모임 리스트 조회
export const getCommunitiesService = async (page, size) => {
    const communities = await getCommunities(page, size);
    return getCommunitiesDto(communities, page, size);
};
