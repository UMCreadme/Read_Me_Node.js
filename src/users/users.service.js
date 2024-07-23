import {
    findById,
    findFollowerNumByUserId,
    findFollowingNumByUserId,
    findUserShortsById,
    findUserLikeShortsById,
    findUserBooksById,
    findImageById,
    followUserAdd
} from "./users.dao.js";
import {userBookResponseDTO, userFollowResponseDTO, userInfoResponseDTO, userShortsResponseDTO} from "./users.dto.js";
import {findBookById} from "../book/book.dao.js";
import {status} from "../../config/response.status.js";
import {BaseError} from "../../config/error.js";

// 유저 정보 조회 로직
export const findOne = async(body) => {

    const userId = body.id;
    const userData = await findById(userId)

    // 없는 유저 확인
    if(userData === -1){
        throw new BaseError(status.BAD_REQUEST)
    }

    const profileImg = await findImageById(userData.image_id)

    const followingNum = await findFollowingNumByUserId(userId);
    const followerNum = await findFollowerNumByUserId(userId);

    return userInfoResponseDTO( userData, profileImg.url, followerNum, followingNum);
}


// 유저가 만든 쇼츠 리스트 조회 로직
export const findUserShorts = async(body, offset, limit) => {
    const userId = body.id;

    // 없는 유저 확인
    const userData = await findById(userId)
    if(userData === -1){
        throw new BaseError(status.BAD_REQUEST)
    }

    const userShorts = await findUserShortsById(userId, offset, limit);
    const userShortsResponseDTOList = [];


    for (const userShort of userShorts) {
        let userShortsBook = await findBookById(userShort.book_id);
        let shortsImage = await findImageById(userShort.image_id);
        let result = userShortsResponseDTO(userShort, shortsImage.url, userShortsBook.title, userShortsBook.author);
        userShortsResponseDTOList.push(result);
    }

    return userShortsResponseDTOList
}

// 유저가 찜한 쇼츠 리스트 조회 로직
export const findUserLikeShorts = async(body, offset, limit) => {
    const userId = body.id

    // 없는 유저 확인
    const userData = await findById(userId)
    if(userData === -1){
        throw new BaseError(status.BAD_REQUEST)
    }

    const userLikeShorts = await findUserLikeShortsById(userId, offset, limit);
    const userShortsResponseDTOList = [];

    for (const userLikeShort of userLikeShorts) {
        let userLikeShortsBook = await findBookById(userLikeShort.book_id);
        let shortsImage = await findImageById(userLikeShort.image_id);
        let result = userShortsResponseDTO(userLikeShort, shortsImage.url, userLikeShortsBook.title, userLikeShortsBook.author);
        userShortsResponseDTOList.push(result)
    }

    return userShortsResponseDTOList
}

// 유저가 읽은 책 리스트 조회 로직
export const findUserBooks = async(body, offset, limit) => {
    const userId = body.id

    // 없는 유저 확인
    const userData = await findById(userId)
    if(userData === -1){
        throw new BaseError(status.BAD_REQUEST)
    }

    const userBooks = await findUserBooksById(userId, offset, limit);
    const userBookResponseDTOList = [];

    for (const userBook of userBooks) {
        let bookImage = await findImageById(userBook.image_id);
        let result = userBookResponseDTO(userBook, bookImage.url);
        userBookResponseDTOList.push(result);
    }

    return userBookResponseDTOList;
}

// 유저(본인)가 다른 유저 팔로우하는 로직
export const followNewUser = async(body, followUserId) =>{
    const userId = body.id

    // 없는 유저 확인
    const userData = await findById(userId)
    const followUserData = await findById(followUserId)
    if((userData === -1) || (followUserData === -1)){
        throw new BaseError(status.BAD_REQUEST)
    }




    const followingId = parseInt(followUserId, 10)
    const followStatus = await followUserAdd(userId, followingId)


    // 중복팔로우 예외 처리 + 본인이 본인을 팔로우하려는 경우
    if(!followStatus){
        throw new BaseError(status.BAD_REQUEST)
    }

    return userFollowResponseDTO(userId, followingId)
}