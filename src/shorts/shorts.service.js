import { BaseError } from "../../config/error.js";
import { pageInfo } from "../../config/pageInfo.js";
import { status } from "../../config/response.status.js";
import { createBook, findBookById, getBookCategory, getBookIdByISBN, getCategoryIdByName } from "../book/book.dao.js";
import * as shortsDao from "./shorts.dao.js";
import * as shortsDetailDao from "./shorts.detail.dao.js";
import { getSearchShortsListDto, getShortsDetailListDto } from "./shorts.dto.js";
import { addCommentDao } from "./shorts.dao.js";

// 쇼츠 검색
export const getSearchShorts = async (keyword, page, size) => {
    let result = await getSearchShortsNoPaging(keyword);
    result = result.slice((page-1)*size, (page-1)*size + size + 1);
    
    const hasNext = result.length > size;
    if(hasNext) result.pop();

    return {"data": getSearchShortsListDto(result), "pageInfo": pageInfo(page, result.length, hasNext)};
};

// 쇼츠 검색 (페이징 처리 x)
export const getSearchShortsNoPaging = async (keyword, shortsId=null) => {
    const shortsTitle = await shortsDao.getShortsToTitleKeyword(keyword);
    const shortsAuthor = await shortsDao.getShortsToAuthorKeyword(keyword);
    const shortsTag = await shortsDao.getShortsToTagKeyword(keyword);

    // shortsTitle, shortsAuthor, shortsTag 중 길이가 가장 긴 배열 순서대로 합치기
    const arrays = [ { data: shortsTitle }, { data: shortsAuthor }, { data: shortsTag } ];
    arrays.sort((a, b) => b.data.length - a.data.length);

    // 정렬된 순서대로 배열 합치기
    let result = [...arrays[0].data, ...arrays[1].data, ...arrays[2].data];

    // shorts_id 값 중복되는 것 제거
    result = result.filter((short, index) => result.findIndex(s => s.shorts_id === short.shorts_id) === index);

    if(shortsId != null) {
        // shortsId에 해당하는 값부터 반환
        const idx = result.findIndex(short => short.shorts_id === shortsId);
        if(idx != -1) {
            result = result.slice(idx);
        }
    }
    return result;
};

// 메인 화면 > 쇼츠 상세 조회
export const getShortsDetailHome = async (shortsId, category, page, size) => {
    let result = []; let hasNext;
    
    // 첫 번째 페이지일 경우 누른 쇼츠 정보를 먼저 조회
    if (page == 1) {
        result = await shortsDetailDao.getShortsDetailToShortsId(shortsId);
        result.push(...await shortsDetailDao.getShortsDetailToCategory(shortsId, category, size, (page-1)*size));

        hasNext = result.length > size;
        if(hasNext) result.pop();
    } else {
        result = await shortsDetailDao.getShortsDetailToCategory(shortsId, category, size+1, (page-1)*size - 1);
        hasNext = result.length > size;
        if(hasNext) result.pop();
    }

    return {"data": getShortsDetailListDto(result), "pageInfo": pageInfo(page, result.length, hasNext)};
};

// 검색 화면 > 쇼츠 상세 조회
export const getShortsDetailSearch = async (shortsId, category, keyword, page, size) => {
    // PM님 요구사항: 검색한 쇼츠에 해당하는 3-5개 쇼츠 이후 카테고리 관련 추천 쇼츠 반환
    const SEARCHSIZE = 5;
    let result; let hasNext;

    const totalPages = Math.ceil(SEARCHSIZE / size);
    const lastCount = SEARCHSIZE % size;

    let keywordShorts = await getSearchShortsNoPaging(keyword, shortsId);
    keywordShorts = keywordShorts.slice(0, SEARCHSIZE);

    if (page > totalPages) {
        result = await shortsDetailDao.getShortsDetailToCategoryExcludeKeyword(category, keywordShorts.map(short => short.shorts_id), size+1, (page-totalPages-1)*size + lastCount);
        hasNext = result.length > size;
        if(hasNext) result.pop();
    } else {
        result = keywordShorts.slice((page-1)*size, (page-1)*size + Math.min(size, SEARCHSIZE));
        result.push(...await shortsDetailDao.getShortsDetailToCategoryExcludeKeyword(category, result.map(short => short.shorts_id), size - result.length + 1, 0));
        hasNext = result.length > size;
        if(hasNext) result.pop();
    }

    return {"data": getShortsDetailListDto(result), "pageInfo": pageInfo(page, result.length, hasNext)};
};

// 책 상세 화면 > 쇼츠 상세 조회
export const getShortsDetailBook = async (shortsId, bookId, page, size) => {
    // 책 정보가 존재하지 않을 경우 빈 배열 반환
    const bookInfo = await findBookById(bookId);
    if(bookInfo.length == 0) return {"data": [], "pageInfo": pageInfo(page, 0, false)};

    const totalPages = Math.ceil(await shortsDetailDao.countShortsDetailToBook(bookId) / size);
    const lastCount = await shortsDetailDao.countShortsDetailToBook(bookId) % size;

    const category = await getBookCategory(bookId);
    let result; let hasNext;

    // 전체 페이지 수보다 큰 페이지를 요청할 경우 (책에 해당하는 쇼츠 조회 끝난 경우), 책과 관련된 카테고리 쇼츠를 반환
    if(page > totalPages) {
        result = await shortsDetailDao.getShortsDetailToCategoryExcludeBook(category, bookId, size+1, (page-totalPages-1)*size + lastCount);
        hasNext = result.length > size;
        if(hasNext) result.pop();
    } else if(page == 1) {
        result = await shortsDetailDao.getShortsDetailToShortsId(shortsId);
        result.push(...await shortsDetailDao.getShortsDetailToBook(shortsId, bookId, size, (page-1)*size));

        hasNext = result.length > size;
        if(hasNext) result.pop();
        else {
            result.push(...await shortsDetailDao.getShortsDetailToCategoryExcludeBook(category, bookId, size - result.length + 1, 0));
            hasNext = result.length > size;
            if(hasNext) result.pop();
        }
    } else {
        result = await shortsDetailDao.getShortsDetailToBook(shortsId, bookId, size+1, (page-1)*size - 1);
        hasNext = result.length > size;
        if(hasNext) result.pop();
        else {
            result.push(...await shortsDetailDao.getShortsDetailToCategoryExcludeBook(category, bookId, size - result.length + 1, 0));
            hasNext = result.length > size;
            if(hasNext) result.pop();
        }
    }

    return {"data": getShortsDetailListDto(result), "pageInfo": pageInfo(page, result.length, hasNext)};
};

// 유저 올린 쇼츠 > 쇼츠 상세 조회
export const getShortsDetailUser = async (shortsId, userId, page, size) => {
    const result = await shortsDetailDao.getShortsDetailToUser(shortsId, userId, size+1, (page-1)*size);
    const hasNext = result.length > size;
    if(hasNext) result.pop();

    return {"data": getShortsDetailListDto(result), "pageInfo": pageInfo(page, result.length, hasNext)};
};

// 유저 좋아요한 쇼츠 > 쇼츠 상세 조회
export const getShortsDetailUserLike = async (shortsId, userId, page, size) => {
    const result = await shortsDetailDao.getShortsDetailToUserLike(shortsId, userId, size+1, (page-1)*size);
    const hasNext = result.length > size;
    if(hasNext) result.pop();

    return {"data": getShortsDetailListDto(result), "pageInfo": pageInfo(page, result.length, hasNext)};
};

// 쇼츠 생성
export const createShorts = async (book, shorts, category) => {
    // ISBN 값으로 book_id 조회
    let bookId = await getBookIdByISBN(book.ISBN);
    
    // book_id 값이 존재하지 않을 경우 책 정보 생성
    if(bookId === undefined) {
        const categoryId = await getCategoryIdByName(category);
        if(categoryId === undefined) {
            throw new BaseError(status.CATEGORY_NOT_FOUND);
        }

        book.category_id = categoryId;
        bookId = await createBook(book);
    }

    // 쇼츠 정보 글자수 제한 확인
    if(shorts.title.length > 30) {
        throw new BaseError(status.SHORTS_TITLE_TOO_LONG);
    }
    if(shorts.content.length > 255) {
        throw new BaseError(status.SHORTS_CONTENT_TOO_LONG);
    }
    if(shorts.phrase.length > 150) {
        throw new BaseError(status.SHORTS_PHRASE_TOO_LONG);
    }
    if(shorts.tag.length > 10) {
        throw new BaseError(status.SHORTS_TAG_TOO_LONG);
    }
    for(const tag of shorts.tag) {
        if(tag.length > 10) {
            throw new BaseError(status.SHORTS_TAG_TOO_LONG);
        }
    }

    // 쇼츠 정보 생성
    shorts.tag = shorts.tag.join("|");
    shorts.book_id = bookId;
    return await shortsDao.createShorts(shorts);
};

export const addCommentService = async (shorts_id, user_id, content) => {
    const isShortsExist = await shortsDao.doesShortExistDao(shorts_id);
    if (!isShortsExist) {
        throw new BaseError(status.BAD_REQUEST, '유효하지 않은 shorts_id입니다.');
    }
    await addCommentDao(shorts_id, user_id, content);

}