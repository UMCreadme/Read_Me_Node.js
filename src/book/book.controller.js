import {response} from "../../config/response.js";
import {status} from "../../config/response.status.js";
import {pageInfo} from "../../config/pageInfo.js";
import {findUserRecentBook} from "./book.service.js";

export const getUserRecentBook = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await findUserRecentBook(req.body, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}