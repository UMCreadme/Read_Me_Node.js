import { pageInfo } from "../../config/pageInfo.js";
import { getBookCategory } from "../book/book.dao.js";
import { countShortsDetailToBook, getShortsDetailToBook, getShortsDetailToCategory, getShortsDetailToCategoryExcludeBook, getShortsDetailToCategoryExcludeKeyword, getShortsDetailToKeyword, getShortsDetailToUser, getShortsDetailToUserLike } from "./shorts.detail.dao.js";
import { getShortsDetailListDto } from "./shorts.dto.js";

export const getShortsDetailHome = async (category, page, size) => {
    const result = await getShortsDetailToCategory(category, size+1, (page-1)*size);
    const hasNext = result.length > size;
    if(hasNext) result.pop();

    return {"data": getShortsDetailListDto(result), "pageInfo": pageInfo(page, size, hasNext)};
}

export const getShortsDetailSearch = async (category, keyword, page, size) => {
    // PM님 요구사항: 검색한 쇼츠에 해당하는 3-5개 쇼츠 이후 카테고리 관련 추천 쇼츠 반환
    const SEARCHSIZE = 5;
    let result; let hasNext;

    const totalPages = Math.ceil(SEARCHSIZE / size);
    const lastCount = SEARCHSIZE % size;

    const keywordShorts = await getShortsDetailToKeyword(keyword, SEARCHSIZE, 0);

    if (page > totalPages) {
        result = await getShortsDetailToCategoryExcludeKeyword(category, keywordShorts.map(short => short.shorts_id), size+1, (page-totalPages-1)*size + lastCount);
        hasNext = result.length > size;
        if(hasNext) result.pop();
    } else {
        result = keywordShorts.slice((page-1)*size, (page-1)*size + Math.min(size, SEARCHSIZE));
        result.push(...await getShortsDetailToCategoryExcludeKeyword(category, result.map(short => short.shorts_id), size - result.length + 1, 0));
        hasNext = result.length > size;
        if(hasNext) result.pop();
    }

    return {"data": getShortsDetailListDto(result), "pageInfo": pageInfo(page, size, hasNext)};
}

export const getShortsDetailBook = async (bookId, page, size) => {
    const totalPages = Math.ceil(await countShortsDetailToBook(bookId) / size);
    const lastCount = await countShortsDetailToBook(bookId) % size;
    let result; let hasNext;

    const category = await getBookCategory(bookId);

    if(page > totalPages) {
        result = await getShortsDetailToCategoryExcludeBook(category, bookId, size+1, (page-totalPages-1)*size + lastCount);
        hasNext = result.length > size;
        if(hasNext) result.pop();
    } else {
        result = await getShortsDetailToBook(bookId, size+1, (page-1)*size);
        hasNext = result.length > size;
        if(hasNext) result.pop();
        else {
            result.push(...await getShortsDetailToCategoryExcludeBook(category, bookId, size - result.length + 1, 0));
            hasNext = result.length > size;
            if(hasNext) result.pop();
        }
    }

    return {"data": getShortsDetailListDto(result), "pageInfo": pageInfo(page, size, hasNext)};
}

export const getShortsDetailUser = async (userId, page, size) => {
    const result = await getShortsDetailToUser(userId, size+1, (page-1)*size);
    const hasNext = result.length > size;
    if(hasNext) result.pop();

    return {"data": getShortsDetailListDto(result), "pageInfo": pageInfo(page, size, hasNext)};
}

export const getShortsDetailUserLike = async (userId, page, size) => {
    const result = await getShortsDetailToUserLike(userId, size+1, (page-1)*size);
    const hasNext = result.length > size;
    if(hasNext) result.pop();

    return {"data": getShortsDetailListDto(result), "pageInfo": pageInfo(page, size, hasNext)};
}
