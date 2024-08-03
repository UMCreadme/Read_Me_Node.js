import { createCommunity, addAdminToCommunity } from './communities.dao.js';
import { createCommunityDto } from './communities.dto.js';
import { getCommunities } from './communities.dao.js';
import { getCommunitiesDto } from './communities.dto.js';

// 커뮤니티 생성
export const createCommunityService = async (userId, bookId, address, tag, capacity) => {
    // 현재 UTC 시간을 기준으로 한국 시간(KST)으로 변환
    const now = new Date();
    now.setHours(now.getUTCHours() + 9);  // UTC 시간에 9시간 더해 한국 시간으로 설정

    // toISOString() 대신 toLocaleString()을 사용하여 KST 형식으로 변환
    const createdAt = now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    const updatedAt = createdAt;

    const communityId = await createCommunity(userId, bookId, address, tag, capacity, createdAt, updatedAt);
    // 방장을 커뮤니티에 추가
    await addAdminToCommunity(communityId, userId);

    return createCommunityDto({
        communityId,
        userId,
        bookId,
        address,
        tag,
        capacity,
        createdAt,
        updatedAt
    });
}

// 전체 모임 리스트 조회
export const getCommunitiesService = async (page, size) => {
    const communities = await getCommunities(page, size);
    return getCommunitiesDto(communities, page, size);
};
