// 홈에서 카테고리별 숏츠 리스트 조회시 반환값
export const categoryShortsResponseDTO = (shorts) => {
    return {
        "userId" : shorts.user_id,
        "profileImg": shorts.profileImg,
        "nickname": shorts.nickname,
        "shortsId": shorts.shorts_id,
        "bookId": shorts.book_id,
        "shortsImg": shorts.shortsImg,
        "phrase": shorts.phrase,
        "title": shorts.title,
        "content": shorts.content,
        "tags": shorts.tag ? shorts.tag.split("|") : [],
        "isLike": Boolean(shorts.isLike),
        "likeCnt": shorts.likeCnt,
        "commentCnt": shorts.commentCnt,
        "postingDate": shorts.created_at
    }
}

export const HomeInfoResponseDTO = (user_id, categories, shorts, feeds) => {
    return {
        "categories": categories,
        "shorts": shorts.map(shorts => ({
            "shorts_id": shorts.shorts_id,
            "shortsImg": shorts.shortsImg,
            "phrase": shorts.phrase,
            "bookTitle": shorts.book_title,
            "author": shorts.author,
            "translator": shorts.translator,
            "category": shorts.category
        })),
        "feeds": feeds.map(feeds => ({
            "user_id": feeds.user_id,
            "profileImg": feeds.profileImg,
            "nickname": feeds.nickname,
            "shorts_id": feeds.shorts_id,
            "shortsImg": shorts.shortsImg,
            "phrase": shorts.phrase,
            "title": shorts.title,
            "content": feeds.content,
            "tags": feeds.tag ? feed.tag.split("|") : [],
            "isLike": Boolean(feeds.isLike),
            "likeCnt": feeds.likeCnt,
            "commentCnt": feeds.commentCnt,
            "postingDate": feeds.created_at
        }))
    }}