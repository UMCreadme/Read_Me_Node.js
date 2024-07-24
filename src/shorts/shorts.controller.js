import { getSearchShorts, getShortsDetailBook, getShortsDetailHome, getShortsDetailSearch, getShortsDetailUser, getShortsDetailUserLike } from "./shorts.service.js";
import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { BaseError } from "../../config/error.js";

export const getShortsDetail = async (req, res, next) => {
    const { category, keyword, book, user, like, page=1, size=10 } = req.query;
    const shortsId = req.params.shortsId;
    let shorts;

    if (keyword !== undefined && category !== undefined) {
        shorts = await getShortsDetailSearch(parseInt(shortsId), category, keyword, parseInt(page), parseInt(size));
    } else if (book !== undefined) {
        shorts = await getShortsDetailBook(parseInt(shortsId), book, parseInt(page), parseInt(size));
    } else if (user !== undefined && like) {
        shorts = await getShortsDetailUserLike(parseInt(shortsId), parseInt(user), parseInt(page), parseInt(size));
    } else if (user !== undefined) {
        shorts = await getShortsDetailUser(parseInt(shortsId), parseInt(user), parseInt(page), parseInt(size));
    } else if (category !== undefined) {
        shorts = await getShortsDetailHome(parseInt(shortsId), category, parseInt(page), parseInt(size));
    } else {
        throw new BaseError(status.BAD_REQUEST);
    }

    res.send(response(status.SUCCESS, shorts.data, shorts.pageInfo));
};

export const searchShorts = async (req, res, next) => {
    const { keyword, page=1, size=10 } = req.query;
    const shorts = await getSearchShorts(keyword, parseInt(page), parseInt(size));

    res.send(response(status.SUCCESS, shorts.data, shorts.pageInfo));
};
