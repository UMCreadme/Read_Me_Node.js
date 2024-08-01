import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { getBookDetailInfo } from "./book.service.js";

export const getBookDetail = async (req, res, next) => {
    const ISBN = req.params.ISBN;
    const { page=1, size=10 } = req.query;
    const userId = 1; // TODO: 유저 인가 구현 후 수정
    
    const book = await getBookDetailInfo(ISBN, parseInt(page), parseInt(size), userId);

    res.send(response(status.SUCCESS, book.data, book.pageInfo));
}
