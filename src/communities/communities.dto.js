// DTO 변환 함수
export const getCommunitiesDto = (data) => {
    return data.communities.map(community => ({
        communityId: community.community_id,
        userId: community.user_id,
        bookId: community.book_id,
        address: community.address ? community.address.split('|') : [], // check for undefined
        tags: community.tags ? community.tags.split('|') : [], // check for undefined
        capacity: community.capacity,
        createdAt: community.created_at,
        updatedAt: community.updated_at
    }));
};
