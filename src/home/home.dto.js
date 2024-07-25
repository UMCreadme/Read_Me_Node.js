// 홈에서 카테고리별 숏츠 리스트 조회시 반환값
export const categoryShortsResponseDTO = (short, userData, isLike, likeCount, commentCount) => {
    return {
        "userId" : short.user_id,
        "profileImg": userData ? userData.profile_img : null,
        "nickname": userData.nickname,
        "shortsId": short.shorts_id,
        "bookId": short.book_id,
        "shortsImg": short.image_id,
        "phrase": short.phrase,
        "title": short.title,
        "content": short.content,
        "tags": short.tags.split('|'),
        "isLike": Boolean(isLike),
        "likeCnt": likeCount,
        "commentCnt": commentCount,
        "postingDate": short.created_at
    }
}

// 홈에서 필요한 정보 조회시 반환값
export const HomeInfoResponseDTO = (categories, recommendShorts, followingFeeds) => {
    return {
        categories: categories.map(category => ({
            id: category.id,
            name: category.name,
        })),
        recommendShorts: recommendShorts.map(shorts => ({
            shortsId: shorts.shorts_id,
            shortsImg: shorts.shortsImg,
            phrase: shorts.phrase,
            bookTitle: shorts.bookTitle,
            author: shorts.author,
            translator: shorts.translator,
            category: shorts.category,
        })),
        followingFeeds: followingFeeds.map(feed => ({
            userId: feed.user_id,
            profileImg: feed.profile_img,
            nickname: feed.nickname,
            shortsId: feed.shorts_id,
            shortsImg: feed.image_id,
            phrase: feed.phrase,
            title: feed.title,
            content: feed.content,
            tags: feed.tags.split('|'),
            isLike: Boolean(feed.isLike),
            likeCnt: feed.likeCnt,
            commentCnt: feed.commentCnt,
            postingDate: feed.created_at,
        }))
    };
}

