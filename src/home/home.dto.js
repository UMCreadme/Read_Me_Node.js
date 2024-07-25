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
