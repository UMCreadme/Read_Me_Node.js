import { pageInfo } from "../../config/pageInfo.js";
import { countShortsDetailToBook, getBookCategory, getShortsDetailToBook, getShortsDetailToCategory, getShortsDetailToCategoryExcludeBook, getShortsDetailToUser } from "./shorts.detail.dao.js";
import { getShortsDetailListDto } from "./shorts.dto.js";

export const getShortsDetailHome = async (category, page, size) => {
    const result = await getShortsDetailToCategory(category, size+1, (page-1)*size);
    const hasNext = result.length > size;
    if(hasNext) result.pop();

    return {"data": getShortsDetailListDto(result), "pageInfo": pageInfo(page, size, hasNext)};
}

export const getShortsDetailSearch = async (category, keyword, page, size) => {

    return {"data": "검색", "pageInfo": pageInfo(page, size, true)};
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

export const getShortsDetailUserLike = async (category, userId, page, size) => {

    return {"data": "유저 찜", "pageInfo": pageInfo(page, size, true)};
}