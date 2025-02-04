// 홈에서 카테고리별 숏츠 리스트 조회시 반환값
export const categoryShortsResponseDTO = (shorts) => {
    return {
        "userId" : shorts.user_id,
        "profileImg": shorts.profileImg,
        "account": shorts.account,
        "shortsId": shorts.shorts_id,
        "shortsImg": shorts.shortsImg,
        "phrase": shorts.phrase,
        "phraseX": shorts.phrase_x,
        "phraseY": shorts.phrase_y,
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
        "categories": categories?.map(category => category.name),
        "shorts": shorts ? shorts.map(shorts => ({
            "shorts_id": shorts.shorts_id,
            "shortsImg": shorts.shortsImg,
            "phrase": shorts.phrase,
            "phraseX": shorts.phrase_x,
            "phraseY": shorts.phrase_y,
            "bookTitle": shorts.title,
            "author": shorts.author,
            "likeCnt":shorts.likeCnt,
            "category": shorts.category
        })) : [],
        "feeds": feeds ? feeds.map(feeds => ({
            "userId": feeds.user_id,
            "account": feeds.account,
            "profileImg": feeds.profileImg,
            "shorts_id": feeds.shorts_id,
            "shortsImg": feeds.shortsImg,
            "phrase": feeds.phrase,
            "phraseX": feeds.phrase_x,
            "phraseY": feeds.phrase_y,
            "title": feeds.title,
            "content": feeds.content,
            "tags": feeds.tag ? feeds.tag.split("|") : [],
            "isLike": Boolean(feeds.isLike),
            "likeCnt": feeds.likeCnt,
            "commentCnt": feeds.commentCnt,
            "postingDate": feeds.created_at
        })) : []
    }}