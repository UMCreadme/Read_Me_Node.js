// communities.dto.js
export const getCommunitiesDto = (data, page, size) => {
    const hasNext = data.communities.length > size;
    const communities = hasNext ? data.communities.slice(0, size) : data.communities; // size보다 하나 더 조회된 경우 자르기

    return {
        communityList: communities.map(community => ({communityList: {
                communityId: community.community_id,
                userId: community.user_id,
                bookId: community.book_id,
                address: community.address.split('|'),
                tags: community.tag ? community.tag.split('|') : [],
                capacity: community.capacity,
                createdAt: community.created_at,
                updatedAt: community.updated_at
            }

        })),
        hasNext // DTO에서 hasNext를 반환
    };
};
