import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

// 커뮤니티 상세
export const communitiesInfoDTO = (community, communityBook, currentCount) => {
    
    return{   
        "bookImg" : communityBook.image_url,
        "bookTitle" : communityBook.title,
        "Participants" : currentCount,
        "capacity" : community.capacity,
        "tag": community.tags,
        "location" : community.location
    }
};

// 내가 참여한 커뮤니티 상세
export const mycommunitiesInfoDTO = (community, communityBook, currentCount, unreadCnt) => {
    
    return{   
    "bookImg" : communityBook.image_url,
        "bookTitle" : communityBook.title,
        "Participants" : currentCount,
        "capacity" : community.capacity,
        "tag": community.tags,
        "location" : community.location,
        "unReadCount" : unreadCnt
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

// DTO 변환 함수
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
