import { pageInfo } from '../../config/pageInfo.js';  

export const createCommunityDto = (data) => ({
    communityId: data.communityId,  // DTO에 필요한 ID만 포함
    userId: data.userId,
    bookId: data.bookId,
    address: data.address.split('|'),
    tag: data.tag ? data.tag.split('|') : [],
    capacity: data.capacity
});

export const getCommunitiesDto = (data, page, size) => {
    const hasNext = data.communities.length > size;
    const communities = hasNext ? data.communities.slice(0, size) : data.communities; // size보다 하나 더 조회된 경우 자르기

    return {
        pageInfo: pageInfo(page, communities.length, hasNext),
        result: {
            groupList: communities.map(community => ({
                groupId: community.community_id,
                userId: community.user_id,
                bookId: community.book_id,
                address: community.address.split('|'),
                tags: community.tag ? community.tag.split('|') : [],
                capacity: community.capacity,
                createdAt: community.created_at,
                updatedAt: community.updated_at
            }))
        }
    };
};
