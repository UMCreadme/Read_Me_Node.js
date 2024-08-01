import * as service from "./shorts.service.js";
import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import imgUploader from "../../config/s3.manager.js";
import { BaseError } from "../../config/error.js";
import { shortsInfoDto } from "./shorts.dto.js";
import { bookInfoDto } from "../book/book.dto.js";
import { addCommentService } from "./shorts.service.js";

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
        throw new BaseError(status.BAD_REQUEST);
    }

    res.send(response(status.SUCCESS, shorts.data, shorts.pageInfo));
};

export const searchShorts = async (req, res, next) => {
    const { keyword, page=1, size=10 } = req.query;
    const shorts = await service.getSearchShorts(keyword, parseInt(page), parseInt(size));

    res.send(response(status.SUCCESS, shorts.data, shorts.pageInfo));
};

export const createShorts = async (req, res, next) => {
    const book = bookInfoDto(req.body);

    if(req.file === undefined) {
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }
    const shorts = shortsInfoDto(req.body, req.file.location);

    const shortsId = await service.createShorts(book, shorts, req.body.category);

    if(shortsId === undefined) {
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }

    res.send(response(status.CREATED));
}

export const addComment = async (req, res, next) => {
    const shorts_id = req.params.shortsId;
    const { user_id, content } = req.body;   //TODO: 미들웨어 추가되면 수정

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