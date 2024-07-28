import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import {
    findOne,
    findUserShorts,
    findUserLikeShorts,
    findUserBooks,
    followNewUser,
    searchUserByKeyword
} from "./users.service.js";
import { pageInfo } from "../../config/pageInfo.js";


// 유저 정보 조회
export const getUserInfo = async (req, res, next) => {
    res.send(response(status.SUCCESS , await findOne(req.body)))
}

// 유저가 만든 쇼츠 리스트 조회
export const getUserShorts = async(req, res, next)=> {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await findUserShorts(req.body, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))

}

//유저가 찜한 쇼츠 리스트 조회
export const getUserLikeShorts = async(req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await findUserLikeShorts(req.body, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

// 유저가 읽은 책 리스트 조회
export const getUserBooks = async(req, res, next)=> {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await findUserBooks(req.body, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

// 유저(본인)가 다른 유저 팔로우
export const followUser = async(req, res, next)=>{
    const result= await  followNewUser (req.body, req.params.userId)
    res.send(response(status.SUCCESS, result))
}

// 유저 검색
export const searchUser = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page - 1) * size;

    const { userSearchResponseDTOList, totalCount, currentSize } = await searchUserByKeyword(req.body, req.query.keyword, offset, size);

    const hasNext = totalCount > offset + size;

    res.send(response(status.SUCCESS, userSearchResponseDTOList, pageInfo(page, currentSize, hasNext)))
}
