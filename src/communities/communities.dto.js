import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const communitiesInfoDTO = (community, communityBook, currentCount) => {
    
    return{   
        "bookImg" : communityBook.image_url,
        "bookTitle" : communityBook.title,
        "Participants" : currentCount,
        "capacity" : community.capacity,
        "tags" : community.tag ? community.tag.split('|') : [],
        "location" : community.location
    }
};

export const mycommunitiesInfoDTO = (community, communityBook, currentCount, unreadCnt) => {
    
    return{   
    "bookImg" : communityBook.image_url,
        "bookTitle" : communityBook.title,
        "Participants" : currentCount,
        "capacity" : community.capacity,
        "tags" : community.tag ? community.tag.split('|') : [],
        "location" : community.location,
        "unReadCount" : unreadCnt
    }
}; 

// 쇼츠 생성 때 입력되는 필수값들
export const creatCommunityDto= (data, userId) => {
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