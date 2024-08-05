import {
    findById,
    findEachFollowWithKeyword,
    findFollowerNumByUserId,
    findFollowingNumByUserId,
    hasRecentPostForUser,
    checkIsFollowed,
    findMeFollowWithKeyword,
    findMeWithKeyword,
    findMyFollowWithKeyword,
    findUserBooksById,
    findUserLikeShortsById,
    findUserShortsById,
    findUsersWithKeyword,
    followUserAdd,
    userLogin,
    userSignUp
} from "./users.dao.js";
import {
    userBookResponseDTO,
    userFollowResponseDTO,
    userInfoResponseDTO,
    otherUserInfoResponseDTO,
    userSearchResponseDTO,
    userShortsResponseDTO,
    userSignUpResponseDTO
} from "./users.dto.js";

import { findFollowStatus } from "../users/users.sql.js";
import {findBookById} from "../book/book.dao.js";
import {status} from "../../config/response.status.js";
import {BaseError} from "../../config/error.js";
import {refresh, sign} from "../jwt/jwt-util.js";

// 회원가입 후 토큰 반환
export const join = async(body, provider) => {


    const refreshToken = refresh()
    const newUser = await userSignUp(body, provider, refreshToken);

    const tokenToUser = {user_id: newUser.user_id, email: newUser.email}
    const accessToken = sign(tokenToUser)

    return userSignUpResponseDTO(accessToken, newUser.refresh_token)
}

// 이미 존재하는 유저가 다시 로그인해서 토큰 값 줄때
export const login = async(body, provider) => {

    const refreshToken = refresh()
    const foundUser = await userLogin(body, provider, refreshToken)

    if(!foundUser){
        return null
    }

    const tokenToUser = {user_id: foundUser.user_id, email: foundUser.email}
    const accessToken = sign(tokenToUser)

    return {accessToken, refreshToken}
}

// 유저 정보 조회 로직
export const findOne = async(userId) => {
    const userData = await findById(userId)
    // 없는 유저 확인
    if(userData === -1){
        throw new BaseError(status.MEMBER_NOT_FOUND)
    }

    const isRecentPost = await hasRecentPostForUser(userId);
    const followingNum = await findFollowingNumByUserId(userId);
    const followerNum = await findFollowerNumByUserId(userId);

    return userInfoResponseDTO( userData, isRecentPost, followerNum, followingNum);
}

// 다른 유저 정보 조회 로직
export const findOneOther = async(myId, userId) => {
    const userData = await findById(userId)
    // 없는 유저 확인
    if(userData === -1){
        throw new BaseError(status.MEMBER_NOT_FOUND)
    }

    const isRecentPost = await hasRecentPostForUser(userId); // 프로필 띠 기능
    const followStatus = await checkIsFollowed(myId, userId); // 팔로우 여부 체크
    const followingNum = await findFollowingNumByUserId(userId); // 팔로잉 수
    const followerNum = await findFollowerNumByUserId(userId); // 팔로우 수

    return otherUserInfoResponseDTO(userData, isRecentPost, followStatus, followerNum, followingNum);
}

// 유저가 만든 쇼츠 리스트 조회 로직
export const findUserShorts = async(userId, offset, limit) => {
    // 없는 유저 확인
    const userData = await findById(userId)
    if(userData === -1){
        throw new BaseError(status.MEMBER_NOT_FOUND)
    }

    const userShorts = await findUserShortsById(userId, offset, limit);
    const userShortsResponseDTOList = [];


    for (const userShort of userShorts) {
        let userShortsBook = await findBookById(userShort.book_id);
        let result = userShortsResponseDTO(userShort, userShortsBook.title, userShortsBook.author);
        userShortsResponseDTOList.push(result);
    }

    return userShortsResponseDTOList
}

// 유저가 찜한 쇼츠 리스트 조회 로직
export const findUserLikeShorts = async(userId, offset, limit) => {
    // 없는 유저 확인
    const userData = await findById(userId)
    if(userData === -1){
        throw new BaseError(status.MEMBER_NOT_FOUND)
    }

    const userLikeShorts = await findUserLikeShortsById(userId, offset, limit);
    const userShortsResponseDTOList = [];

    for (const userLikeShort of userLikeShorts) {
        let userLikeShortsBook = await findBookById(userLikeShort.book_id);
        let result = userShortsResponseDTO(userLikeShort, userLikeShortsBook.title, userLikeShortsBook.author);
        userShortsResponseDTOList.push(result)
    }

    return userShortsResponseDTOList
}

// 유저가 읽은 책 리스트 조회 로직
export const findUserBooks = async(userId, offset, limit) => {
    // 없는 유저 확인
    const userData = await findById(userId)
    if(userData === -1){
        throw new BaseError(status.MEMBER_NOT_FOUND)
    }

    const userBooks = await findUserBooksById(userId, offset, limit);
    const userBookResponseDTOList = [];

    for (const userBook of userBooks) {
        let result = userBookResponseDTO(userBook);
        userBookResponseDTOList.push(result);
    }

    return userBookResponseDTOList;
}

// 유저(본인)가 다른 유저 팔로우하는 로직
export const followNewUser = async(userId, followUserId) => {
    // 없는 유저 확인
    const userData = await findById(userId)
    const followUserData = await findById(followUserId)
    if((userData === -1) || (followUserData === -1)){
        throw new BaseError(status.MEMBER_NOT_FOUND)
    }

    const followingId = parseInt(followUserId, 10)
    const followStatus = await followUserAdd(userId, followingId)

    // 중복팔로우 예외 처리 + 본인이 본인을 팔로우하려는 경우
    if(!followStatus){
        throw new BaseError(status.BAD_REQUEST)
    }

    return userFollowResponseDTO(userId, followingId)
}

// 유저 검색 기능 로직
export const searchUserByKeyword = async (userId, keyword, offset, size) => {
    // 키워드에 나 자신의 이름이 섞이는 경우
    const searchMySelf = await findMeWithKeyword(userId, keyword);

    // 키워드 + 맞팔인 사람 리스트 (account 기준)
    const eachFollowUsersListByAccount = await findEachFollowWithKeyword(userId, keyword, 'account');

    // 키워드 + 내가 팔로우하는 사람 리스트 (account 기준)
    const myFollowUsersListByAccount = await findMyFollowWithKeyword(userId, keyword, 'account');

    // 키워드 + 나를 팔로우하는 사람 리스트 (account 기준)
    const meFollowUsersListByAccount = await findMeFollowWithKeyword(userId, keyword, 'account');

    // 키워드에 해당하는 모든 사람 리스트 (account 기준)
    const allUsersListByAccount = await findUsersWithKeyword(userId, keyword, 'account')

    // 키워드로 검색한 최종 유저 목록 (account 기준)
    const searchFollowUserByAccountList = eachFollowUsersListByAccount.concat(myFollowUsersListByAccount, meFollowUsersListByAccount)
    if(searchMySelf != null) searchFollowUserByAccountList.unshift(searchMySelf)
    const searchUserSet = new Set(searchFollowUserByAccountList.map(user => user.user_id));
    const uniqueUsers = allUsersListByAccount.filter(user => !searchUserSet.has(user.user_id));
    const searchUserByAccountList= [...searchFollowUserByAccountList, ...uniqueUsers];

    // 키워드 + 맞팔인 사람 리스트 (nickname 기준)
    const eachFollowUsersListByNickname = await findEachFollowWithKeyword(userId, keyword, 'nickname');

    // 키워드 + 내가 팔로우하는 사람 리스트 (nickname 기준)
    const myFollowUsersListByNickname = await findMyFollowWithKeyword(userId, keyword, 'nickname');

    // 키워드 + 나를 팔로우하는 사람 리스트 (nickname 기준)
    const meFollowUsersListByNickname = await findMeFollowWithKeyword(userId, keyword, 'nickname');

    // 키워드에 해당하는 모든 사람 리스트 (nickname 기준)
    const allUsersListByNickname = await findUsersWithKeyword(userId, keyword, 'nickname')

    // 키워드로 검색한 최종 유저 목록 (nickname 기준)
    const searchFollowUserByNicknameList = eachFollowUsersListByNickname.concat(myFollowUsersListByNickname, meFollowUsersListByNickname)
    if(searchMySelf != null)searchFollowUserByNicknameList.unshift(searchMySelf)
    const searchUserSet2 = new Set(searchFollowUserByNicknameList.map(user => user.user_id));
    const uniqueUsers2 = allUsersListByNickname.filter(user => !searchUserSet2.has(user.user_id));
    const searchUserByNicknameList= [...searchFollowUserByNicknameList, ...uniqueUsers2];

    // 최종 리스트
    const mergedList = searchUserByAccountList.length >= searchUserByNicknameList.length
        ? [...searchUserByAccountList, ...searchUserByNicknameList]
        : [...searchUserByNicknameList, ...searchUserByAccountList];

    const combinedList = Array.from(new Map(mergedList.map(user => [user.user_id, user])).values());
    const paginatedList = combinedList.slice(offset, offset + size);

    const userSearchResponseDTOList = []
    for (const paginatedListElement of paginatedList) {
        userSearchResponseDTOList.push(userSearchResponseDTO(paginatedListElement))
    }

    return {userSearchResponseDTOList, totalCount: combinedList.length, currentSize: paginatedList.length}
}