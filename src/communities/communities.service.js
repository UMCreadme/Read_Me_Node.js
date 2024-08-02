import { searchCommunities } from './communities.dao.js';
import { communityDto } from './communities.dto.js';

// 커뮤니티 검색 서비스
export const searchCommunityService = async (query, page = 1, size = 10) => {
    // 전체 검색 결과를 가져온다
    const allCommunities = await searchCommunities(query);

    // 페이지네이션 계산
    const offset = (page - 1) * size;
    const paginatedCommunities = allCommunities.slice(offset, offset + size);

    return {
        totalElements: allCommunities.length,
        communities: paginatedCommunities.map(communityDto)
    };
};
