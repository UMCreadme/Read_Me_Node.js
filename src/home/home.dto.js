// 홈에서 카테고리별 숏츠 리스트 조회시 반환값
export const categoryShortsResponseDTO = (shorts, userData, isLike, likeCount, commentCount) => {
    return {
        "userId" : shorts.user_id,
        "profileImg": userData.image_url,
        "nickname": userData.nickname,
        "shortsId": shorts.shorts_id,
        "bookId": shorts.book_id,
        "shortsImg": shorts.image_url,
        "phrase": shorts.phrase,
        "title": shorts.title,
        "content": shorts.content,
        "tags": shorts.tags.split('|'),
        "isLike": Boolean(isLike),
        "likeCnt": likeCount,
        "commentCnt": commentCount,
        "postingDate": shorts.created_at
    }
}
