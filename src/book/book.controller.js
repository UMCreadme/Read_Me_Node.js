import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { getBookDetailInfo, updateBookIsRead, findUserRecentBook, createDummyBookDataService} from "./book.service.js";
import { bookInfoDto } from "./book.dto.js";

export const getBookDetail = async (req, res, next) => {
    const ISBN = req.params.ISBN;
    const { page=1, size=10 } = req.query;
    const userId = req.user_id;
    
    const book = await getBookDetailInfo(ISBN, parseInt(page), parseInt(size), userId);

    res.send(response(status.SUCCESS, book.data, book.pageInfo));
};

export const updateIsRead = async (req, res, next) => {
    req.body.ISBN = req.params.ISBN;
    const userId = req.user_id;

    const book = bookInfoDto(req.body);

    res.send(response(await updateBookIsRead(book, req.body.cid, userId)));
};

export const getUserRecentBook = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size
    const userId = req.user_id;

    const result = await findUserRecentBook(userId, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

export const createDummyBookDataController = async (req, res, next) => {
    await createDummyBookDataService();
    res.send(response(status.SUCCESS));
}