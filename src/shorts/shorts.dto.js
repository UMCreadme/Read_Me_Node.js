export const getShortsDetailListDto = (data) => {
    const shortsList = [];

    for(const short of data) {
        shortsList.push({
            "userId": short.user_id,
            "userAccount": short.account,
            "profileImg": short.profile_img,
            "isFollow": Boolean(short.isFollow),
            "shortsImg": short.shorts_img,
            "phrase": short.phrase,
            "title": short.title,
            "content": short.content,
            "tags": short.tag ? short.tag.split("|") : [],
            "isLike": Boolean(short.isLike),
            "likeCnt": short.like_count,
            "commentCnt": short.comment_count,
            "bookId": short.book_id
        });
    }

    return shortsList;
}