import * as dao from "./users.dao.js";
import {
    userBookResponseDTO,
    userInfoResponseDTO,
    userSearchResponseDTO,
    userShortsResponseDTO,
    userSignUpResponseDTO
} from "./users.dto.js";
import {findBookById} from "../book/book.dao.js";
import {status} from "../../config/response.status.js";
import {BaseError} from "../../config/error.js";
import {refresh, sign} from "../jwt/jwt-util.js";
import { addSearchDao, getResearchId, updateSearchDao } from "../research/research.dao.js";

// 회원가입 후 토큰 반환
export const join = async(body, provider) => {
    const duplicateAccountCheck = await dao.checkDuplicateAccount(body.account)

    if(duplicateAccountCheck){
        throw new BaseError(status.DUPLICATE_ACCOUNT)
    }

    const accountCheck = (account) => {
        const regex = /^[a-zA-Z0-9]{1,30}$/;
        return regex.test(account);
    }

    const nicknameCheck = (nickname) => {
        const regex = /^[a-zA-Z0-9가-힣]{1,12}$/;
        return regex.test(nickname);
    }

    const categoryCheck = (category) => {
        const duplicateCategory = (new Set(category).size !== category.length)
        return (category.length < 4)  || (category.length >8) || duplicateCategory
    }

    if(!body.uniqueId || !body.email || !accountCheck(body.account) || !nicknameCheck(body.nickname) || categoryCheck(body.categoryIdList))
    {
        throw new BaseError(status.PARAMETER_IS_WRONG)
    }

    const refreshToken = refresh()
    const newUser = await dao.userSignUp(body, provider, refreshToken);

    const tokenToUser = {user_id: newUser.user_id, email: newUser.email}
    const accessToken = sign(tokenToUser)

    return userSignUpResponseDTO(accessToken, newUser.refresh_token)
}

// 이미 존재하는 유저가 다시 로그인해서 토큰 값 줄때
export const login = async(body, provider) => {
    if(!body.uniqueId || !body.email){
        throw new BaseError(status.PARAMETER_IS_WRONG)
    }

    const refreshToken = refresh()
    const foundUser = await dao.userLogin(body, provider, refreshToken)

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

    const isRecentPost = await dao.hasRecentPostForUser(userId); // 프로필 띠 기능
    const followingNum = await dao.findFollowingNumByUserId(userId);
    const followerNum = await dao.findFollowerNumByUserId(userId);
    const readBookNum = await dao.findUserBooksCountById(userId);

    return userInfoResponseDTO(userData, isRecentPost, followerNum, followingNum, readBookNum);
}

// 다른 유저 팔로잉 여부 확인 로직
export const isFollowing = async(myId, userId) => {
    // 없는 유저 확인
    const userData = await dao.findById(userId)
    if(userData === -1){
        throw new BaseError(status.MEMBER_NOT_FOUND)
    }

    const followStatus = await dao.checkIsFollowed(myId, userId); // 팔로우 여부 체크

    return followStatus;
}

//유저 프로필 수정
export const updateUser = async(userId, body, profileImg) =>{
    if(!body.nickname || !body.account){
        throw new BaseError(status.PARAMETER_IS_WRONG)
    }
    await editUserInfo(userId, body, profileImg)
}

// 유저가 만든 쇼츠 리스트 조회 로직
export const findUserShorts = async(userId, offset, limit) => {
    // 없는 유저 확인
    const userData = await dao.findById(userId)
    if(userData === -1){
        throw new BaseError(status.MEMBER_NOT_FOUND)
    }

    const userShorts = await dao.findUserShortsById(userId, offset, limit);
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
    const userData = await dao.findById(userId)
    if(userData === -1){
        throw new BaseError(status.MEMBER_NOT_FOUND)
    }

    const userLikeShorts = await dao.findUserLikeShortsById(userId, offset, limit);
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
    const userData = await dao.findById(userId)
    if(userData === -1){
        throw new BaseError(status.MEMBER_NOT_FOUND)
    }

    const userBooks = await dao.findUserBooksById(userId, offset, limit);
    const userBookResponseDTOList = [];

    for (const userBook of userBooks) {
        let result = userBookResponseDTO(userBook);
        userBookResponseDTOList.push(result);
    }

    return userBookResponseDTOList;
}

// 유저(본인)가 다른 유저 팔로우하는 로직
export const followNewUser = async(userId, followUserId) =>{
    // 없는 유저 확인
    const followUserData = await dao.findById(followUserId)
    if(followUserData === -1){
        throw new BaseError(status.MEMBER_NOT_FOUND)
    }

    const followStatus = await dao.followUserAdd(userId, followUserId)

    // 중복팔로우 예외 처리 + 본인이 본인을 팔로우하려는 경우
    if(!followStatus){
        throw new BaseError(status.FOLLOW_EXIST)
    }
}

// 유저(본인)가 다른 유저 팔로우 취소하는 로직
export const unfollowUser = async(myId, unfollowUserId) => {
    // 유저 존재 확인
    const unfollowUserData = await dao.findById(unfollowUserId)
    if(unfollowUserData === -1){
        throw new BaseError(status.MEMBER_NOT_FOUND)
    }

    // 현재 팔로우 상태 확인
    const isFollowing = await dao.checkIsFollowed(myId, unfollowUserId);
    if (!isFollowing) {
        throw new BaseError(status.FOLLOW_NOT_FOUND);
    }

    // 팔로우 취소
    const unfollowStatus = await dao.followUserCancel(myId, unfollowUserId);
    if(!unfollowStatus){
        throw new BaseError(status.BAD_REQUEST)
    }

    return userFollowResponseDTO(userId, followingId)
}

// 유저 검색 기능 로직
export const searchUserByKeyword = async (userId, keyword, offset, size) => {
    // 키워드에 나 자신의 이름이 섞이는 경우
    const searchMySelf = await dao.findMeWithKeyword(userId, keyword);

    // 키워드 + 맞팔인 사람 리스트 (account 기준)
    const eachFollowUsersListByAccount = await dao.findEachFollowWithKeyword(userId, keyword, 'account');

    // 키워드 + 내가 팔로우하는 사람 리스트 (account 기준)
    const myFollowUsersListByAccount = await dao.findMyFollowWithKeyword(userId, keyword, 'account');

    // 키워드 + 나를 팔로우하는 사람 리스트 (account 기준)
    const meFollowUsersListByAccount = await dao.findMeFollowWithKeyword(userId, keyword, 'account');

    // 키워드에 해당하는 모든 사람 리스트 (account 기준)
    const allUsersListByAccount = await dao.findUsersWithKeyword(userId, keyword, 'account')

    // 키워드로 검색한 최종 유저 목록 (account 기준)
    const searchFollowUserByAccountList = eachFollowUsersListByAccount.concat(myFollowUsersListByAccount, meFollowUsersListByAccount)
    if(searchMySelf != null) searchFollowUserByAccountList.unshift(searchMySelf)
    const searchUserSet = new Set(searchFollowUserByAccountList.map(user => user.user_id));
    const uniqueUsers = allUsersListByAccount.filter(user => !searchUserSet.has(user.user_id));
    const searchUserByAccountList= [...searchFollowUserByAccountList, ...uniqueUsers];

    // 키워드 + 맞팔인 사람 리스트 (nickname 기준)
    const eachFollowUsersListByNickname = await dao.findEachFollowWithKeyword(userId, keyword, 'nickname');

    // 키워드 + 내가 팔로우하는 사람 리스트 (nickname 기준)
    const myFollowUsersListByNickname = await dao.findMyFollowWithKeyword(userId, keyword, 'nickname');

    // 키워드 + 나를 팔로우하는 사람 리스트 (nickname 기준)
    const meFollowUsersListByNickname = await dao.findMeFollowWithKeyword(userId, keyword, 'nickname');

    // 키워드에 해당하는 모든 사람 리스트 (nickname 기준)
    const allUsersListByNickname = await dao.findUsersWithKeyword(userId, keyword, 'nickname')

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

    const recentSerachId = await getResearchId(userId, keyword);
    if(!recentSerachId) {
        await addSearchDao(userId, keyword);
    } else {
        await updateSearchDao(recentSerachId);
    }

    return {userSearchResponseDTOList, totalCount: combinedList.length, currentSize: paginatedList.length}
}

// 카테고리 수정
export const ChangeCategoryService = async(user_id, category) => {
    const hasDuplicates = (arr) => {
        return new Set(arr).size !== arr.length;
    };

    // category 배열에 중복된 값이 있는지 검사
    if (hasDuplicates(category)) {
        throw new BaseError(status.CATEGORY_DUPLICATED);
    }

    return await dao.changeCategoryDao(user_id, category);
}