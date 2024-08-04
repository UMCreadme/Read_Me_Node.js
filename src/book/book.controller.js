import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { getBookDetailInfo, updateBookIsRead, findUserRecentBook} from "./book.service.js";
import { bookInfoDto } from "./book.dto.js";

export const getBookDetail = async (req, res, next) => {
    const ISBN = req.params.ISBN;
    const { page=1, size=10 } = req.query;
    const userId = 1; // TODO: 유저 인가 구현 후 수정
    
    const book = await getBookDetailInfo(ISBN, parseInt(page), parseInt(size), userId);

    res.send(response(status.SUCCESS, book.data, book.pageInfo));
};

export const updateIsRead = async (req, res, next) => {
    req.body.ISBN = req.params.ISBN;
    const userId = 1; // TODO: 추후 인가 미들웨어 구현 이후 수정

    const book = bookInfoDto(req.body);

    res.send(response(await updateBookIsRead(book, req.body.cid, userId)));
};

export const getUserRecentBook = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size

    const result = await findUserRecentBook(req.body, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}