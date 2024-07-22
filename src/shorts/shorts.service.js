import { pageInfo } from "../../config/pageInfo.js";
import { countShortsDetailToBook, getBookCategory, getShortsDetailToBook, getShortsDetailToCategory, getShortsDetailToCategoryExcludeBook } from "./shorts.dao.js";
import { getShortsDetailListDto } from "./shorts.dto.js";

export const getShortsDetailHome = async (category, page=1, size=10) => {
    const result = await getShortsDetailToCategory(category, size+1, (page-1)*size);
    const hasNext = result.length > size;
    if(hasNext) result.pop();

    return {"data": getShortsDetailListDto(result), "pageInfo": pageInfo(page, size, hasNext)};
}

export const getShortsDetailSearch = async (category, keyword, page=1, size=10) => {

    return {"data": "검색", "pageInfo": pageInfo(page, size, true)};
}

export const getShortsDetailBook = async (bookId, page=1, size=10) => {
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

export const getShortsDetailUser = async (category, userId, page=1, size=10) => {

    return {"data": "유저 마이", "pageInfo": pageInfo(page, size, true)};
}

export const getShortsDetailUserLike = async (category, userId, page=1, size=10) => {

    return {"data": "유저 찜", "pageInfo": pageInfo(page, size, true)};
}