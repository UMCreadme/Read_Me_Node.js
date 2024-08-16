import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

// 커뮤니티 상세
export const communitiesInfoDTO = (community, communityBook, currentCount, tagsList) => {
    
    return{   
        "bookImg" : communityBook.link,
        "bookTitle" : communityBook.title,
        "Participants" : currentCount,
        "capacity" : community.capacity,
        "tags": tagsList,
        "location" : community.location,
        "community_id" : community.community_id
    }
};

// 내가 참여한 커뮤니티 상세
export const mycommunitiesInfoDTO = (community, communityBook, currentCount, unreadCnt, tagsList) => {
    
    return{   
        "bookImg" : communityBook.link,
        "bookTitle" : communityBook.title,
        "Participants" : currentCount,
        "capacity" : community.capacity,
        "tags": tagsList,
        "location" : community.location,
        "unReadCount" : unreadCnt,
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
