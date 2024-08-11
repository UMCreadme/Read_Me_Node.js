import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { getBookDetailInfo, updateBookIsRead, findUserRecentBook, searchBookService, createBookSearchService, getBookDetailInfoById, createBook } from "./book.service.js";
import { bookInfoDto } from "./book.dto.js";
import { pageInfo } from "../../config/pageInfo.js";
import { BaseError } from "../../config/error.js";

// 책 상세 정보 조회
export const getBookDetail = async (req, res, next) => {
    const id = req.params.id;
    const { page=1, size=10, isBookId } = req.query;
    const userId = req.user_id;

    if(!id) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    if(isBookId === 'true') {
        const result = await getBookDetailInfoById(parseInt(id), parseInt(page), parseInt(size), userId);
        return res.send(response(status.SUCCESS, result.data, result.pageInfo));
    } else {
        const result = await getBookDetailInfo(id, parseInt(page), parseInt(size), userId);
        return res.send(response(status.SUCCESS, result.data, result.pageInfo));
    }
};

// 책 읽음 여부 업데이트
export const updateIsRead = async (req, res, next) => {
    const isBookId = req.query.isBookId;
    const userId = req.user_id;

    // 책 ID로 들어온 요청이 아닐 경우에만 책 정보 저장
    let bookId;
    if(isBookId === 'true') {
        bookId = parseInt(req.params.id);
    } else {
        req.body.ISBN = req.params.id;
    
        const book = bookInfoDto(req.body);
        bookId = await createBook(book, req.body.cid, userId);
    }

    res.send(response(await updateBookIsRead(bookId, userId)));
};

// 최근 선택한 책
export const getUserRecentBook = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page -1) * size
    const userId = req.user_id;

    const result = await findUserRecentBook(userId, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
};

// 책 검색
export const searchBook = async (req, res, next) => {
    let { page=1, size=50, keyword, preview } = req.query;
    const userId = req.user_id;
    if(!keyword) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    keyword = keyword.trim();
    const book = await searchBookService(userId, keyword, preview === 'true', parseInt(page), parseInt(size));

    res.send(response(status.SUCCESS, book.data, book.pageInfo));
};

// 책 검색어 추가
export const createBookSearch = async (req, res, next) => {
    const userId = req.user_id;
    const keyword = req.body.keyword;
    req.body.ISBN = req.params.ISBN;
    const book = bookInfoDto(req.body);

    await createBookSearchService(book, req.body.cid, keyword, userId);

    res.send(response(status.CREATED));
};
