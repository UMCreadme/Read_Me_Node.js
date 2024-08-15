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
    const { start, keyword } = req.query;
    let { page=1, size=20 } = req.query; size = parseInt(size);
    const shortsId = parseInt(req.params.shortsId);
    const userId = req.user_id; // 좋아요 여부 체크를 위한 userId값
    console.log('userId', userId);

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
    let shorts = await service.getShortsDetailById(shortsId, userId);
    if(page === 1) {
        size -= 1; offset += 1;
    }

    let result;
    if (start === MAIN) {
        // 추천 탭 경로
        result = await service.getShortsDetailHome(shortsId, userId, size, offset);
    } else if (start === SEARCH && keyword) {
        // 검색 경로
        result = await service.getShortsDetailSearch(shortsId, userId, keyword, size, offset);
    } else if (start === BOOK) {
        // 책 상세 경로
        result = await service.getShortsDetailBook(shortsId, userId, size, offset);
    } else if (start === USER) {
        // 유저 올린 쇼츠 경로
        result = await service.getShortsDetailUser(shortsId, userId, size, offset);
    } else if (start === LIKE) {
        // 유저 좋아요한 쇼츠 경로
        result = await service.getShortsDetailUserLike(shortsId, userId, size, offset);
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
    let { keyword, page=1, size=10 } = req.query;
    const userId = req.user_id;

    if(!keyword) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    keyword = keyword.trim();
    const shorts = await service.getSearchShorts(userId, keyword, parseInt(page), parseInt(size));

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

    await service.addCommentService(shorts_id, user_id, content);
    res.send(response(status.CREATED));
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
