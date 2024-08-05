import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import {
    findOne,
    findOneOther,
    findUserShorts,
    findUserLikeShorts,
    findUserBooks,
    followNewUser,
    searchUserByKeyword, join, login
} from "./users.service.js";
import { pageInfo } from "../../config/pageInfo.js";
import {BaseError} from "../../config/error.js";

//카카오 로그인 후 처음 디비에 들어오는 사람일 경우
export const kakaoSignUp = async(req, res, next) => {
    const result =  await join(req.body, 'kakao')
    res.send(response(status.SUCCESS, result))
}

// 카카오 로그인
export const kakaoLogin = async (req,res, next) =>{

    try {
        const result = await login(req.body, 'kakao')
        if (!result) {
            return res.send(response(status.MEMBER_NOT_FOUND))
        }
        return res.send(response(status.SUCCESS, result))
    }
    catch (err){
        return next(new BaseError(status.BAD_REQUEST))
    }
}
// 다른 유저 정보 조회
export const getOtherUserInfo = async (req, res, next) => {
    const myId = req.user_id;
    const userId = parseInt(req.params.userId)
    res.send(response(status.SUCCESS, await findOneOther(myId, userId)));
}

// 유저 정보 조회
export const getUserInfo = async (req, res, next) => {
    res.send(response(status.SUCCESS , await findOne(req.user_id)))
}

// 유저가 만든 쇼츠 리스트 조회
export const getUserShorts = async(req, res, next)=> {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await findUserShorts(parseInt(req.user_id), offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))

}

// 유저가 만든 쇼츠 리스트 조회 (비회원)
export const getUserShortsForGuest = async(req, res, next)=> {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    
    const result = await findUserShorts(parseInt(req.params.userId), offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))

}

//유저가 찜한 쇼츠 리스트 조회
export const getUserLikeShorts = async(req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await findUserLikeShorts(req.user_id, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

//유저가 찜한 쇼츠 리스트 조회 (비회원)
export const getUserLikeShortsForGuest = async(req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await findUserLikeShorts(parseInt(req.params.userId), offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

// 유저가 읽은 책 리스트 조회
export const getUserBooks = async(req, res, next)=> {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size
    const result = await findUserBooks(req.user_id, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

// 유저가 읽은 책 리스트 조회 (비회원)
export const getUserBooksForGuest = async(req, res, next)=> {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await findUserBooks(parseInt(req.params.userId), offset, size+1)


    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

// 유저(본인)가 다른 유저 팔로우
export const followUser = async(req, res, next)=>{
    const result= await  followNewUser (req.user_id, req.params.userId)
    return res.send(response(status.SUCCESS, result))
}

// 유저 검색
export const searchUser = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page - 1) * size;

    const { userSearchResponseDTOList, totalCount, currentSize } = await searchUserByKeyword(req.user_id || null, req.query.keyword, offset, size);

    const hasNext = totalCount > offset + size;

    res.send(response(status.SUCCESS, userSearchResponseDTOList, pageInfo(page, currentSize, hasNext)))
}