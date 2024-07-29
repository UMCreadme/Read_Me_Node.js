import { pageInfo } from '../../config/pageInfo.js';  // 적절한 경로로 수정

export const communityDto = (data) => ({
    communityId: data.communityId,
    userId: data.userId,
    bookId: data.bookId,
    address: data.address.split('|'),
    tags: data.tags ? data.tags.split('|') : [],
    capacity: data.capacity,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
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
