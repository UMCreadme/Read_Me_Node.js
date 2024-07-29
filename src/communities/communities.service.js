import { searchCommunities } from './communities.dao.js';
import { communityDto } from './communities.dto.js';

// 커뮤니티 검색 서비스
export const searchCommunityService = async (query, page = 1, size = 10) => {
    const offset = (page - 1) * size;
    const communities = await searchCommunities(query, size, offset);
    return communities.map(communityDto);
};
