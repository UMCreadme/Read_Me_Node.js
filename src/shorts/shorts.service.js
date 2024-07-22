import { pageInfo } from "../../config/pageInfo.js";
import { getShortsDetailToCategory } from "./shorts.dao.js";
import { getShortsDetailListDto } from "./shorts.dto.js";

export const getShortsDetailHome = async (category, page=1, size=10) => {
    const userId = 1;

    const result = await getShortsDetailToCategory(category, userId, size+1, (page-1)*size);
    const hasNext = result.length > size;
    if(hasNext) result.pop();

    return {"data": getShortsDetailListDto(result), "pageInfo": pageInfo(page, size, hasNext)};
}

export const getShortsDetailSearch = async (category, keyword, page=1, size=10) => {

    return {"data": "검색", "pageInfo": pageInfo(page, size, true)};
}

export const getShortsDetailBook = async (category, bookId, page=1, size=10) => {

    return {"data": "책", "pageInfo": pageInfo(page, size, true)};
}

export const getShortsDetailUser = async (category, userId, page=1, size=10) => {

    return {"data": "유저 마이", "pageInfo": pageInfo(page, size, true)};
}

export const getShortsDetailUserLike = async (category, userId, page=1, size=10) => {

    return {"data": "유저 찜", "pageInfo": pageInfo(page, size, true)};
}