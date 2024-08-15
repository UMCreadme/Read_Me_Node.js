export const getCommunitiesDto = (data) => {
    return data.communities.map(community => ({
        communityId: community.community_id,
        userId: community.user_id,
        bookId: community.book_id,
        address: community.address ? community.address.split('|') : [], // check for undefined
        tags: community.tag ? community.tag.split('|') : [],
        capacity: community.capacity,
        createdAt: community.created_at,
        updatedAt: community.updated_at
    }));
};

export const getCommunityDetailsDto = (data, isParticipating) => {
    const community = data[0];  
    return {
        book: {
            title: community.title,
            author: community.author,
            imageUrl: community.book_image
        },
        leader: {
            imageUrl: community.leader_image,
            account: community.leader_account,
            nickname: community.leader_nickname,
            userId: community.leader_id
        },
        location: community.location,
        createdAt: community.created_at,
        updatedAt: community.updated_at,
        content: community.content,
        tags: community.tag ? community.tag.split('|') : [],
        capacity: community.capacity,
        currentMembers: community.member_count,
        isParticipating 
    };
};


export const getChatroomDetailsDto = (data, members, currentUserId) => {
    const community = data[0];
    return {
        title: community.title,
        tags: community.tag ? community.tag.split('|') : [],
        where: {
            position: community.position,
            address: community.address
        },
        meetingDate: community.meeting_date,
        members: members.map(member => ({
            userId: member.user_id,
            profileImage: member.image_url,
            nickname: member.nickname,
            isMine: member.user_id === currentUserId
        }))
    };
};
