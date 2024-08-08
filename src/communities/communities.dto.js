export const communitiesInfoDTO = (community, communityBook, currentCount) => {
    
    return{   
        "bookImg" : communityBook.image_url,
        "bookTitle" : communityBook.title,
        "Participants" : currentCount,
        "capacity" : community.capacity,
        "tags" : community.tag ? community.tag.split('|') : [],
        "address" : community.address
    }
};