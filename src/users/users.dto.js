// 유저의 마이프로필 페이지에서 유저 정보 조회시 반환값
export const userInfoResponseDTO = (userData, followerNum, followingNum) => {
    return {
        "userId" : userData.user_id,
        "nickname" : userData.nickname,
        "account" : userData.account,
        "comment" : userData.comment,
        "followerNum" : followerNum,
        "followingNum" : followingNum,
        "profileImg" : userData.image_url }
}

// 유저의 프로필 화면(마이페이지)에 쇼츠 리스트 조회시 반환값
export const userShortsResponseDTO = (userShorts, shortsBookTitle, shortsBookAuthor) => {

    return{   "shortsId" : userShorts.shorts_id,
        "shortsImage" : userShorts.image_url,
        "shortsPhrase" : userShorts.phrase,
        "shortsBookTitle" : shortsBookTitle,
        "shortsBookAuthor" : shortsBookAuthor
    }

}

// 유저가 읽은 책 리스트 조회시 반환값
export const userBookResponseDTO = (userBook) => {

    return {
        "bookImage" : userBook.image_url,
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

// 유저 검색시 반환 정보
export const userSearchResponseDTO =  (userData) => {
    return {
        "userId" : userData.user_id,
        "profileImg" : userData.image_url,
        "account" : userData.account,
        "nickname" : userData.nickname
    }
}

// 유저 회원가입 성공시 반환 정보
export const userSignUpResponseDTO = (accessToken, refreshToken) => {
    return {
        "accessToken" : accessToken,
        "refreshToken" : refreshToken
    }
}