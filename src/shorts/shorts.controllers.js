import { getShortsDetailBook, getShortsDetailHome, getShortsDetailSearch, getShortsDetailUser, getShortsDetailUserLike } from "./shorts.service.js";
import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";

export const getShortsDetail = async (req, res, next) => {
    const { category, keyword, book, user, like, page=1, size=10 } = req.query;
    let shorts;

    if (keyword !== undefined) {
        shorts = await getShortsDetailSearch(category, keyword, parseInt(page), parseInt(size));
    } else if (book !== undefined) {
        shorts = await getShortsDetailBook(book, parseInt(page), parseInt(size));
    } else if (user !== undefined && like) {
        shorts = await getShortsDetailUserLike(user, parseInt(page), parseInt(size));
    } else if (user !== undefined) {
        shorts = await getShortsDetailUser(user, parseInt(page), parseInt(size));
    } else if (category !== undefined) {
        shorts = await getShortsDetailHome(category, parseInt(page), parseInt(size));
    } else {
        throw new BaseError(status.BAD_REQUEST);
    }

    res.send(response(status.SUCCESS, shorts.data, shorts.pageInfo));
};