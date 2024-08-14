import { BaseError } from "../../config/error.js";
import { pageInfo } from "../../config/pageInfo.js";
import { status } from "../../config/response.status.js";
import { findBookById, getBookCategory } from "../book/book.dao.js";
import * as shortsDao from "./shorts.dao.js";
import * as shortsDetailDao from "./shorts.detail.dao.js";
import { getSearchShortsListDto, getShortsDetailListDto } from "./shorts.dto.js";
import { addSearchDao, getResearchId, updateSearchDao } from "../research/research.dao.js";
import { shuffle } from "../common/common.algorithm.js";

// 인기순 기준값
export const POPULARITY_LIKE_CNT = 20;

// 쇼츠 ID로 쇼츠 정보 조회
export const getShortsDetailById = async (shortsId, userId) => {
    const result = await shortsDetailDao.getShortsDetailToShortsId(shortsId, userId);

    // 쇼츠 정보가 존재하지 않을 경우 에러 반환
    if(result.length == 0) {
        throw new BaseError(status.SHORTS_NOT_FOUND);
    }

    return getShortsDetailListDto(result);
};

// 쇼츠 검색
export const getSearchShorts = async (userId, keyword, page, size) => {
    let result = await getSearchShortsNoPaging(keyword);
    result = result.slice((page-1)*size, (page-1)*size + size + 1);
    
    const hasNext = result.length > size;
    if(hasNext) result.pop();

    // 검색어 저장 - 회원인 경우
    if(!userId) {
        return {"data": getSearchShortsListDto(result), "pageInfo": pageInfo(page, result.length, hasNext)};
    }

    const recentSearchId = await getResearchId(userId, keyword);
    if(!recentSearchId) {
        await addSearchDao(userId, keyword);
    } else {
        await updateSearchDao(recentSearchId);
    }

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
export const getShortsDetailHome = async (shortsId, userId, size, offset) => {
    // shortsId에 해당하는 카테고리 조회
    const categoryId = await shortsDao.getShortsCategoryById(shortsId);

    // 카테고리에 해당하는 인기 쇼츠 개수 조회
    const count = await shortsDao.countPopularShortsDetailToCategory(categoryId, POPULARITY_LIKE_CNT);

    let popularShorts; let otherShorts; let result; let hasNext;
    if (offset + size <= count) {
        // 인기쇼츠만 내려보내면 되는 경우
        popularShorts = await shortsDetailDao.getPopularShortsDetailToCategory(shortsId, categoryId, userId, size+1, offset);

        hasNext = popularShorts.length > size;
        if(hasNext) popularShorts.pop();
        hasNext = true; // 비인기 쇼츠 조회 필요

        result = shuffle(popularShorts); // 랜덤으로 섞기
    } else if (offset < count && count < offset + size) {
        // 인기 쇼츠 & 비인기 쇼츠 모두 내려보내야 하는 경우
        popularShorts = await shortsDetailDao.getPopularShortsDetailToCategory(shortsId, categoryId, userId, size, offset);
        popularShorts = shuffle(popularShorts); // 랜덤으로 섞기

        // 비인기 쇼츠에 맞는 페이지네이션 정보
        size = size - popularShorts.length; offset = 0;
        otherShorts = await shortsDetailDao.getShortsDetailToCategory(shortsId, categoryId, userId, size+1, offset);

        hasNext = otherShorts.length > size;
        if(hasNext) otherShorts.pop();

        otherShorts = shuffle(otherShorts); // 랜덤으로 섞기
        popularShorts.push(...otherShorts);
        result = popularShorts;
    } else {
        // 비인기 쇼츠만 내려보내면 되는 경우
        otherShorts = await shortsDetailDao.getShortsDetailToCategory(shortsId, categoryId, userId, size+1, offset - count);

        hasNext = result.length > size;
        if(hasNext) result.pop();

        result = shuffle(otherShorts); // 랜덤으로 섞기
    }

    console.log(result);

    return { "data": getShortsDetailListDto(result), "hasNext": hasNext };
};

// 검색 화면 > 쇼츠 상세 조회
export const getShortsDetailSearch = async (shortsId, userId, keyword, size, offset) => {
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
export const createShorts = async (shorts) => {
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
        throw new BaseError(status.SHORTS_TAG_COUNT_TOO_LONG);
    }
    for(const tag of shorts.tag) {
        if(tag.length > 10) {
            throw new BaseError(status.SHORTS_TAG_TOO_LONG);
        }
    }

    // 쇼츠 정보 생성
    shorts.tag = shorts.tag.join("|");
    return await shortsDao.createShorts(shorts);
};


export const addCommentService = async (shorts_id, user_id, content) => {
    const isShortsExist = await shortsDao.doesShortExistDao(shorts_id);
    if (!isShortsExist) {
        throw new BaseError(status.BAD_REQUEST);
    }
    await shortsDao.addCommentDao(shorts_id, user_id, content);

};

export const likeShortsService = async (shorts_id, user_id) => {
    const exists = await shortsDao.doesShortExistDao(shorts_id);
    if (!exists) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    const isLiked = await shortsDao.checkLikeDao(shorts_id, user_id);

    if (isLiked) {
        await shortsDao.removeLikeDao(shorts_id, user_id);
        return { likeCnt: await shortsDao.getLikeCntDao(shorts_id), action: 'remmoved'};
    } else {
        await shortsDao.addLikeDao(shorts_id, user_id);
        return { likeCnt: await shortsDao.getLikeCntDao(shorts_id), action: 'added'};
    }

};

export const deleteShortsService = async (user_id, shorts_id) => {
    const exists = await shortsDao.doesShortExistDao(shorts_id);
    if (!exists) {
        throw new BaseError(status.SHORTS_NOT_FOUND);
    }

    const owner = await shortsDao.checkShortsOwnerDao(shorts_id);
    if (owner !== user_id) {
        throw new BaseError(status.UNAUTHORIZED);
    }

    await shortsDao.deleteShortsDao(shorts_id);
};