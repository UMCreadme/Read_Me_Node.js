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
