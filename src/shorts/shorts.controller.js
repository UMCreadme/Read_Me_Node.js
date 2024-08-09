import * as service from "./shorts.service.js";
import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { BaseError } from "../../config/error.js";
import { shortsInfoDto } from "./shorts.dto.js";
import { bookInfoDto } from "../book/book.dto.js";
import { addCommentService } from "./shorts.service.js";
import { likeShortsService } from "./shorts.service.js";
import { deleteShortsService } from "./shorts.service.js";

export const getShortsDetail = async (req, res, next) => {
    const { category, keyword, book, user, like, page=1, size=10 } = req.query;
    const shortsId = req.params.shortsId;
    let shorts;

    if (keyword !== undefined && category !== undefined) {
        shorts = await service.getShortsDetailSearch(parseInt(shortsId), category, keyword, parseInt(page), parseInt(size));
    } else if (book !== undefined) {
        shorts = await service.getShortsDetailBook(parseInt(shortsId), book, parseInt(page), parseInt(size));
    } else if (user !== undefined && like) {
        shorts = await service.getShortsDetailUserLike(parseInt(shortsId), parseInt(user), parseInt(page), parseInt(size));
    } else if (user !== undefined) {
        shorts = await service.getShortsDetailUser(parseInt(shortsId), parseInt(user), parseInt(page), parseInt(size));
    } else if (category !== undefined) {
        shorts = await service.getShortsDetailHome(parseInt(shortsId), category, parseInt(page), parseInt(size));
    } else {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    res.send(response(status.SUCCESS, shorts.data, shorts.pageInfo));
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
    const book = bookInfoDto(req.body);
    const userId = req.user_id;

    if(!req.file) {
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }
    const shorts = shortsInfoDto(req.body, req.file.location, userId);

    const shortsId = await service.createShorts(book, shorts, req.body.cid);

    if(!shortsId) {
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }

    res.send(response(status.CREATED));
};

export const addComment = async (req, res, next) => {
    const shorts_id = req.params.shortsId;
    const { content } = req.body;
    const { user_id } = req.user_id;

    const MAX_COMMENT_LENGTH = 200; 
    
    if (!shorts_id || !user_id || !content) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    if (content.length > MAX_COMMENT_LENGTH) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await addCommentService(shorts_id, user_id, content);
    res.send(response(status.CREATED));
}


export const likeShorts = async (req, res, next) => {
    const shorts_id = req.params.shortsId;
    const { user_id } = req.user_id;

    if (!shorts_id || !user_id) {
        return next(new BaseError(status.BAD_REQUEST));
    }

    const { likeCnt, action } = await likeShortsService(shorts_id, user_id);
    const responseStatus = action === 'added' ? status.CREATED : status.SUCCESS;
    res.send(response(responseStatus, likeCnt));

}

export const deleteShorts = async (req, res, next) => {
    const user_id = req.user_id;
    const shorts_id  = req.params.shortsId;


    if ( !shorts_id || !user_id ) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
    await deleteShortsService(user_id, shorts_id);
    res.send(response(status.SUCCESS));
}
