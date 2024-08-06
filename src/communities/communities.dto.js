export const getCommunitiesDto = (data) => {
    return data.communities.map(community => ({
        communityId: community.community_id,
        userId: community.user_id,
        bookId: community.book_id,
        address: community.address.split('|'),
        tags: community.tag ? community.tag.split('|') : [],
        capacity: community.capacity,
        createdAt: community.created_at,
        updatedAt: community.updated_at
    }));
};

// 커뮤니티 DTO
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
