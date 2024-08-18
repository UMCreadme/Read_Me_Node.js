import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

// 커뮤니티 상세
export const communitiesInfoDTO = (community) => {
    return {
        "bookImg": community.bookImg,
        "bookTitle": community.title,   
        "Participants" : community.currentCount,
        "capacity" : community.capacity,
        "tags": community.tag ? community.tag.split("|") : [],
        "location" : community.location,
        "community_id" : community.community_id
    }
}; 

// 내가 참여한 커뮤니티 상세
export const mycommunitiesInfoDTO = (community) => {
    return {
        "bookImg": community.bookImg,
        "bookTitle": community.title,   
        "Participants" : community.currentCount,
        "capacity" : community.capacity,
        "tags": community.tag ? community.tag.split("|") : [],
        "location" : community.location,
        "unReadCount" : community.unreadCnt,
        "community_id" : community.community_id
    }
}; 

// 커뮤니티 생성 때 입력되는 필수값들
export const creatCommunityDto = (data, userId) => {
    if (!data || !data.tags || !data.capacity || !data.location || !data.content ) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    return {
        "content": data.content,
        "tag": data.tags,
        "capacity" : data.capacity,
        "location" : data.location,
        "user_id": userId
    };
}

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
