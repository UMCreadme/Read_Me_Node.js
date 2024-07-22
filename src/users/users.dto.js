
// 유저 정보 조회시 반환값
export const userInfoResponseDTO = (userData,  followerNum, followingNum) => {
    return {"nickname" : userData.nickname,
        "account" : userData.account,
        "comment" : userData.comment,
        "followerNum" : followerNum,
        "followingNum" : followingNum,
        "profileImg" : userData.image }
}

// 유저가 만든 쇼츠 리스트 조회시 반환값
export const userShortsResponseDTO = (userShorts, shortsBookTitle, shortsBookAuthor) => {

    return{   "shortsId" : userShorts.shorts_id,
        "shortsImage" : userShorts.image,
        "shortsPhrase" : userShorts.phrase,
        "shortsBookTitle" : shortsBookTitle,
        "shortsBookAuthor" : shortsBookAuthor }

}

// 유저가 읽은 책 리스트 조회시 반환값
export const userBookResponseDTO = (userBook) => {

    return {
        "bookImg" : userBook.image,
        "bookTitle" : userBook.title,
        "bookAuthor" : userBook.author,
        "bookId" : userBook.id
    }

}