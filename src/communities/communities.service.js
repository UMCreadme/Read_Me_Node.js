import { createCommunity, addAdminToCommunity } from './communities.dao.js';
import { createCommunityDto } from './communities.dto.js';

// 커뮤니티 생성
export const createCommunityService = async (userId, bookId, address, tag, capacity) => {
    // 커뮤니티 생성
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
};
