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

export const getCommunityDetailsDto = (data) => {
    const community = data[0];  // 단일 커뮤니티 상세정보이므로 배열의 첫 번째 요소 사용
    return {
        communityId: community.community_id,
        address: community.address,
        tags: community.tag ? community.tag.split('|') : [],
        capacity: community.capacity,
        createdAt: community.created_at,
        updatedAt: community.updated_at,
        book: {
            bookId: community.book_id,
            title: community.title,
            author: community.author,
            imageUrl: community.book_image
        },
        leader: {
            userId: community.user_id,
            account: community.leader_account,
            nickname: community.leader_nickname
        }
    };
};