import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import * as service from "./users.service.js";
import { pageInfo } from "../../config/pageInfo.js";
import {BaseError} from "../../config/error.js";
import { otherUserInfoResponseDTO } from "./users.dto.js";

//카카오 로그인 후 처음 디비에 들어오는 사람일 경우
export const kakaoSignUp = async(req, res, next) => {
    const result =  await service.join(req.body, 'kakao')
    res.send(response(status.SUCCESS, result))
}

// 카카오 로그인
export const kakaoLogin = async (req,res, next) =>{
   const result = await service.login(req.body, 'kakao')

    if (!result) {
        throw new BaseError(status.MEMBER_NOT_FOUND)
    }

    res.send(response(status.SUCCESS, result))

}
// 다른 유저 정보 조회
export const getOtherUserInfo = async (req, res, next) => {
    const myId = req.user_id;
    const userId = parseInt(req.params.userId)

    if (myId === userId) {
        return res.send(response(status.SUCCESS, await service.findOne(myId)));
    }

    const userInfo = await service.findOne(userId);
    const isFollowing = await service.isFollowing(myId, userId);
    const result = await otherUserInfoResponseDTO(userInfo, isFollowing);

    res.send(response(status.SUCCESS, result));
}

// 유저 정보 조회
export const getUserInfo = async (req, res, next) => {
    res.send(response(status.SUCCESS , await service.findOne(req.user_id)))
}

// 유저 프로필 이미지 수정
export const updateUserImage = async(req, res, next) => {
    if(!req.file){
        throw new BaseError(status.INTERNAL_SERVER_ERROR)
    }
    res.send(response(status.SUCCESS, await service.updateUserImageService(req.user_id, req.file.location)))
}

// 유저 프로필 이미지 삭제
export const deleteUserImage = async(req, res, next) => {
    res.send(response(status.SUCCESS, await service.deleteUserImageService(req.user_id)))
}

// 유저 프로필 내용 수정
export const updateUserInfo = async(req, res, next)=> {
    res.send(response(status.SUCCESS, await service.updateUserInfoService(req.user_id, req.body)))
}

// 유저가 만든 쇼츠 리스트 조회
export const getUserShorts = async(req, res, next)=> {
t
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await service.findUserShorts(parseInt(req.user_id), offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))

}

// 유저가 만든 쇼츠 리스트 조회 (비회원)
export const getUserShortsForGuest = async(req, res, next)=> {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await service.findUserShorts(parseInt(req.params.userId), offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))

}

//유저가 찜한 쇼츠 리스트 조회
export const getUserLikeShorts = async(req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await service.findUserLikeShorts(req.user_id, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

//유저가 찜한 쇼츠 리스트 조회 (비회원)
export const getUserLikeShortsForGuest = async(req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await service.findUserLikeShorts(parseInt(req.params.userId), offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

// 유저가 읽은 책 리스트 조회
export const getUserBooks = async(req, res, next)=> {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size
    const result = await service.findUserBooks(req.user_id, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

// 유저가 읽은 책 리스트 조회 (비회원)
export const getUserBooksForGuest = async(req, res, next)=> {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await service.findUserBooks(parseInt(req.params.userId), offset, size+1)


    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

// 유저(본인)가 다른 유저 팔로우
export const followUser = async(req, res, next)=>{
    await service.followNewUser(req.user_id, parseInt(req.params.userId))
    return res.send(response(status.SUCCESS))
}

// 유저(본인)가 다른 유저 팔로우 취소
export const unfollow = async(req, res, next)=>{
    await service.unfollowUser(req.user_id, parseInt(req.params.userId))
    return res.send(response(status.SUCCESS))
}

// 유저 검색
export const searchUser = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page - 1) * size;

    if(!req.query.keyword) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    req.query.keyword = req.query.keyword.trim();

    const { userSearchResponseDTOList, totalCount, currentSize } = await service.searchUserByKeyword(req.user_id, req.query.keyword, offset, size);

    const hasNext = totalCount > offset + size;

    res.send(response(status.SUCCESS, userSearchResponseDTOList, pageInfo(page, currentSize, hasNext)))
}

// 카테고리 수정
export const changeCategory = async (req, res, next) => {
    const user_id = req.user_id;
    const { category } = req.body;

    if (!Array.isArray(category) || category.length < 4 || category.length > 8) {
        return res.send(response(status.CATEGORY_COUNT_IS_WRONG));
    }

    const result = await service.ChangeCategoryService(user_id, category);
    return res.send(response(status.SUCCESS, result));
}

