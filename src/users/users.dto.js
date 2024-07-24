// 유저의 마이프로필 페이지에서 유저 정보 조회시 반환값
export const userInfoResponseDTO = (userData,  profileImg, followerNum, followingNum) => {
    return {
        "userId" : userData.user_id,
        "nickname" : userData.nickname,
        "account" : userData.account,
        "comment" : userData.comment,
        "followerNum" : followerNum,
        "followingNum" : followingNum,
        "profileImg" : profileImg }
}

// 유저의 프로필 화면(마이페이지)에 쇼츠 리스트 조회시 반환값
export const userShortsResponseDTO = (userShorts, shortsImage, shortsBookTitle, shortsBookAuthor) => {

    return{   "shortsId" : userShorts.shorts_id,
        "shortsImage" : shortsImage,
        "shortsPhrase" : userShorts.phrase,
        "shortsBookTitle" : shortsBookTitle,
        "shortsBookAuthor" : shortsBookAuthor
    }

}

// 유저가 읽은 책 리스트 조회시 반환값
export const userBookResponseDTO = (userBook, bookImage) => {

    return {
        "bookImage" : bookImage,
        "bookTitle" : userBook.title,
        "bookAuthor" : userBook.author,
        "bookTranslator" : userBook.translator,
        "bookId" : userBook.id
    }
}

// 팔로잉 성공시 반환해주는 값
export const userFollowResponseDTO = (userId, followingId) =>{
    return {
        "userId" : userId,
        "followingUserId" : followingId
    }
}
