import * as service from "./shorts.service.js";
import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { BaseError } from "../../config/error.js";
import { shortsInfoDto } from "./shorts.dto.js";
import { createBook } from "../book/book.service.js";
import { pageInfo } from "../../config/pageInfo.js";

const MAIN = "main"; const SEARCH = "search"; const BOOK = "book";
const USER = "user"; const LIKE = "like";

export const getShortsDetail = async (req, res, next) => {
    const { start, keyword, userId } = req.query;
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;
    const shortsId = parseInt(req.params.shortsId);
    const myId = req.user_id; // 좋아요 여부 체크를 위한 myId값

    // 필수 파라미터 체크
    if(!start || !shortsId) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    // page, size 값 체크
    page = parseInt(page); size = parseInt(size);
    if((page) < 1 || size < 1) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    let offset = (page - 1) * size - 1; // 가장 첫번째 조회되는 쇼츠 제외를 위한 offset

    // params로 들어온 shortsId에 해당하는 정보 가져오기 (여기서 SHORTS_NOT_FOUND 예외 처리)
    let shorts = await service.getShortsDetailById(shortsId, myId);
    if(page === 1) {
        size -= 1; offset += 1;
    }

    let result;
    if (start === MAIN) {
        // 추천 탭 경로
        result = await service.getShortsDetailHome(shortsId, myId, size, offset);
    } else if (start === SEARCH && keyword) {
        // 검색 경로
        result = await service.getShortsDetailSearch(shortsId, myId, keyword, size, offset);
    } else if (start === BOOK) {
        // 책 상세 경로
        result = await service.getShortsDetailBook(shortsId, myId, size, offset);
    } else if (start === USER) {
        // 유저 올린 쇼츠 경로
        result = await service.getShortsDetailUser(shortsId, myId, size, offset);
    } else if (start === LIKE && userId) {
        // 유저 좋아요한 쇼츠 경로
        result = await service.getShortsDetailUserLike(shortsId, myId, userId, size, offset);
    } else {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    if(page === 1) {
        shorts = [...shorts, ...result.data];
    } else {
        shorts = result.data;
    }
    res.send(response(status.SUCCESS, shorts, pageInfo(page, shorts.length, result.hasNext)));
};

export const searchShorts = async (req, res, next) => {
    let { keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const userId = req.user_id;

    if(!keyword || keyword.trim().length < 1) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    keyword = keyword.trim();
    const shorts = await service.getSearchShorts(userId, keyword, page, size);

    res.send(response(status.SUCCESS, shorts.data, shorts.pageInfo));
};

export const createShorts = async (req, res, next) => {
    const ISBN = req.body.ISBN;
    const userId = req.user_id;

    if(!ISBN) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    if(!req.file) {
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }
    const bookId = await createBook(req.body.ISBN);
    const shorts = shortsInfoDto(req.body, req.file.location, userId);
    shorts.book_id = bookId;

    const shortsId = await service.createShorts(shorts);

    if(!shortsId) {
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }

    res.send(response(status.CREATED));
};

export const addComment = async (req, res, next) => {
    const shorts_id = req.params.shortsId;
    const  content  = req.body.content;
    const  user_id  = req.user_id;

    const MAX_COMMENT_LENGTH = 200; 
    
    if (!shorts_id || !user_id || !content) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    if (content.length > MAX_COMMENT_LENGTH) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    const result = await service.addCommentService(shorts_id, user_id, content);
    res.send(response(status.CREATED, result));
};


export const likeShorts = async (req, res, next) => {
    const shorts_id = req.params.shortsId;
    const  user_id  = req.user_id;

    if (!shorts_id || !user_id) {
        return next(new BaseError(status.BAD_REQUEST));
    }

    const { likeCnt, action } = await service.likeShortsService(shorts_id, user_id);
    const responseStatus = action === 'added' ? status.CREATED : status.SUCCESS;
    res.send(response(responseStatus, likeCnt));
};

export const deleteShorts = async (req, res, next) => {
    const user_id = req.user_id;
    const shorts_id  = req.params.shortsId;


    if ( !shorts_id || !user_id ) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
    await service.deleteShortsService(user_id, shorts_id);
    res.send(response(status.SUCCESS));
};

export const getShortsComment = async (req, res, next) => {
    const shorts_id = parseInt(req.params.shortsId);
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;
    const offset = (page - 1) * size;

    // 필수 파라미터 체크
    if(!shorts_id) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    // page, size 값 체크
    page = parseInt(page); size = parseInt(size);
    if((page) < 1 || size < 1) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    const result = await service.ShortsCommentService(shorts_id, offset, size+1);

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)));

}