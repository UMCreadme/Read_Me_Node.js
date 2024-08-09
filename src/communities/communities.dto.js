export const communitiesInfoDTO = (community, communityBook, currentCount) => {
    
    return{   
        "bookImg" : communityBook.image_url,
        "bookTitle" : communityBook.title,
        "Participants" : currentCount,
        "capacity" : community.capacity,
        "tags" : community.tag ? community.tag.split('|') : [],
        "address" : community.location
    }
};

export const mycommunitiesInfoDTO = (community, communityBook, currentCount, unreadCnt) => {
    
    return{   
    "bookImg" : communityBook.image_url,
        "bookTitle" : communityBook.title,
        "Participants" : currentCount,
        "capacity" : community.capacity,
        "tags" : community.tag ? community.tag.split('|') : [],
        "address" : community.location,
        "unReadCount" : unreadCnt
    }
}; 