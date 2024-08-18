import { BaseError } from "../../config/error.js";
import { pageInfo } from "../../config/pageInfo.js";
import { status } from "../../config/response.status.js";
import * as shortsDao from "./shorts.dao.js";
import * as shortsDetailDao from "./shorts.detail.dao.js";
import { getSearchShortsListDto, getShortsDetailListDto, shortsCommentsResponseDTO } from "./shorts.dto.js";
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
    // 제목으로 쇼츠 검색
    const shortsTitle = await shortsDao.getShortsToTitleKeyword(keyword);
    // 작가 이름으로 쇼츠 검색
    const shortsAuthor = await shortsDao.getShortsToAuthorKeyword(keyword);
    // 태그로 쇼츠 검색
    const shortsTag = await shortsDao.getShortsToTagKeyword(keyword);

    // shortsTitle, shortsAuthor, shortsTag 중 길이가 가장 긴 배열 순서대로 합치기
    const arrays = [ { data: shortsTitle }, { data: shortsAuthor }, { data: shortsTag } ];
    arrays.sort((a, b) => b.data.length - a.data.length);

    // 정렬된 순서대로 배열 합치기
    let result = [...arrays[0].data, ...arrays[1].data, ...arrays[2].data];

    // shorts_id 값 중복되는 것 제거
    result = result.filter((short, index) => result.findIndex(s => s.shorts_id === short.shorts_id) === index);

    if(!shortsId) {
        // shortsId에 해당하는 값부터 반환
        const idx = result.findIndex(short => short.shorts_id === shortsId);
        if(idx != -1) {
            result = result.slice(idx);
        }
    }
    return result;
};

// 메인 화면 > 쇼츠 상세 조회
export const getShortsDetailHome = async (shortsId, userId, size, offset, shorts) => {
    // shortsId에 해당하는 카테고리 조회
    const categoryId = await shortsDao.getShortsCategoryById(shortsId);

    // 카테고리에 해당하는 인기 쇼츠 개수 조회
    let count = await shortsDao.countPopularShortsDetailToCategory(categoryId, POPULARITY_LIKE_CNT);

    if(shorts) {
        // 검색어에 해당하는 쇼츠 중 같은 카테고리인 쇼츠 개수 계산
        const sameCategoryCount = shorts.filter(short => short.category_id === categoryId).length;
        count = count - sameCategoryCount;

        shorts = shorts.map(short => short.shorts_id);
    }

    let popularShorts; let otherShorts; let result; let hasNext;
    if (offset + size <= count) {
        // 인기쇼츠만 내려보내면 되는 경우
        if(shorts) {
            popularShorts = await shortsDetailDao.getPopularShortsDetailToCategoryExcludeShorts(shorts, categoryId, userId, size+1, offset);
        } else {
            popularShorts = await shortsDetailDao.getPopularShortsDetailToCategory(shortsId, categoryId, userId, size+1, offset);
        }

        hasNext = popularShorts.length > size;
        if(hasNext) popularShorts.pop();
        hasNext = true; // 비인기 쇼츠 조회 필요

        result = shuffle(popularShorts); // 랜덤으로 섞기
    } else if (offset < count && count < offset + size) {
        // 인기 쇼츠 & 비인기 쇼츠 모두 내려보내야 하는 경우
        if(shorts) {
            popularShorts = await shortsDetailDao.getPopularShortsDetailToCategoryExcludeShorts(shorts, categoryId, userId, size, offset);
    
            // 비인기 쇼츠에 맞는 페이지네이션 정보
            size = size - popularShorts.length; offset = 0;
            otherShorts = await shortsDetailDao.getShortsDetailToCategoryExcludeShorts(shorts, categoryId, userId, size+1, offset);
        } else {
            popularShorts = await shortsDetailDao.getPopularShortsDetailToCategory(shortsId, categoryId, userId, size, offset);
    
            // 비인기 쇼츠에 맞는 페이지네이션 정보
            size = size - popularShorts.length; offset = 0;
            otherShorts = await shortsDetailDao.getShortsDetailToCategory(shortsId, categoryId, userId, size+1, offset);
        }

        hasNext = otherShorts.length > size;
        if(hasNext) otherShorts.pop();

        popularShorts = shuffle(popularShorts); // 랜덤으로 섞기
        otherShorts = shuffle(otherShorts); // 랜덤으로 섞기
        popularShorts.push(...otherShorts);
        result = popularShorts;
    } else {
        // 비인기 쇼츠만 내려보내면 되는 경우
        if(shorts) {
            otherShorts = await shortsDetailDao.getShortsDetailToCategoryExcludeShorts(shorts, categoryId, userId, size+1, offset - count);
        } else {
            otherShorts = await shortsDetailDao.getShortsDetailToCategory(shortsId, categoryId, userId, size+1, offset - count);
        }

        hasNext = otherShorts.length > size;
        if(hasNext) otherShorts.pop();

        result = shuffle(otherShorts); // 랜덤으로 섞기
    }

    return { "data": getShortsDetailListDto(result), "hasNext": hasNext };
};

// 검색 화면 > 쇼츠 상세 조회 (검색한 쇼츠에 해당하는 3-5개 쇼츠 이후, 클릭한 쇼츠의 카테고리 관련 추천 쇼츠 반환)
export const getShortsDetailSearch = async (shortsId, userId, keyword, size, offset) => {
    const SEARCHSIZE = 4;

    let otherShorts; let result; let hasNext;
    let searchShorts = await getSearchShortsNoPaging(keyword, shortsId);
    if(offset + size <= SEARCHSIZE) {
        // 검색한 쇼츠만 내려보내면 되는 경우
        searchShorts = searchShorts.slice(offset, offset + size + 1);
        
        hasNext = searchShorts.length > size;
        if(hasNext) searchShorts.pop();
        hasNext = true; // 추천 쇼츠 조회 필요

        searchShorts = shuffle(searchShorts); // 랜덤으로 섞기
        result = getShortsDetailListDto(searchShorts);
    } else if(offset < SEARCHSIZE && SEARCHSIZE < offset + size) {
        // 검색한 쇼츠 & 추천 쇼츠 모두 내려보내야 하는 경우
        searchShorts = searchShorts.slice(offset, offset + SEARCHSIZE);
        searchShorts = shuffle(searchShorts); // 랜덤으로 섞기

        // 추천 쇼츠에 맞는 페이지네이션 정보
        size = size - searchShorts.length; offset = 0;
        otherShorts = await getShortsDetailHome(shortsId, userId, size, offset, searchShorts);
        hasNext = otherShorts.hasNext;
        otherShorts = otherShorts.data;

        result = getShortsDetailListDto(searchShorts);
        result.push(...otherShorts);
    } else {
        // 추천 쇼츠만 내려보내면 되는 경우
        otherShorts = await getShortsDetailHome(shortsId, userId, size, offset - SEARCHSIZE, searchShorts);
        hasNext = otherShorts.hasNext;
        result = otherShorts.data;
    }

    return { "data": result, "hasNext": hasNext };
};

// 책 상세 화면 > 쇼츠 상세 조회
export const getShortsDetailBook = async (shortsId, userId, size, offset) => {
    // 쇼츠 ID에 해당하는 책 ID 조회
    const bookId = await shortsDao.getBookIdByShortsId(shortsId);

    // 책에 해당하는 전체 쇼츠 조회 (페이지네이션 x)
    const bookShortsTotal = await shortsDetailDao.getShortsDetailToBook(bookId, size+1, offset, userId, false);

    // 조회한 쇼츠 ID부터 자름
    const idx = bookShortsTotal.findIndex(short => short.shorts_id === shortsId);
    const bookShorts = bookShortsTotal.slice(idx+1);
    // offset 적용
    let bookShortsOffset = bookShorts.slice(offset);
    let result; let hasNext = bookShortsOffset.length >= size;

    if(hasNext) {
        // 책에 해당하는 다음 쇼츠가 있거나 size만큼 쇼츠가 있는 경우
        bookShortsOffset = bookShortsOffset.slice(0, size);
        result = getShortsDetailListDto(bookShortsOffset);
        return { "data": result, "hasNext": hasNext };
    }

    // 책에 해당하는 쇼츠를 모두 조회한 경우 페이지네이션 정보 재계산
    size = size - bookShortsOffset.length; offset = Math.max(offset - bookShorts.length, 0);
    let otherShorts = await getShortsDetailHome(shortsId, userId, size, offset, bookShortsTotal);
    hasNext = otherShorts.hasNext;
    otherShorts = otherShorts.data;

    result = getShortsDetailListDto(bookShortsOffset);
    otherShorts = shuffle(otherShorts); // 랜덤으로 섞기
    result.push(...otherShorts);

    return { "data": result, "hasNext": hasNext };
};

// 유저 올린 쇼츠 > 쇼츠 상세 조회
export const getShortsDetailUser = async (shortsId, myId, size, offset) => {
    // 쇼츠를 올린 유저 ID 조회
    const userId = await shortsDao.getUserIdByShortsId(shortsId);

    const result = await shortsDetailDao.getShortsDetailToUser(shortsId, myId, userId, size+1, offset);
    const hasNext = result.length > size;
    if(hasNext) result.pop();

    return {"data": getShortsDetailListDto(result), "hasNext": hasNext };
};

// 유저 좋아요한 쇼츠 > 쇼츠 상세 조회
export const getShortsDetailUserLike = async (shortsId, myId, userId, size, offset) => {
    // 쇼츠를 좋아요한 userId값이 맞는지 확인
    if(!await shortsDao.checkLikeDao(shortsId, userId)) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    const result = await shortsDetailDao.getShortsDetailToUserLike(shortsId, myId, userId, size+1, offset);
    const hasNext = result.length > size;
    if(hasNext) result.pop();

    return {"data": getShortsDetailListDto(result), "hasNext": hasNext };
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

    const owner = await shortsDao.getUserIdByShortsId(shorts_id);
    if (owner !== user_id) {
        throw new BaseError(status.UNAUTHORIZED);
    }

    await shortsDao.deleteShortsDao(shorts_id);
};


// 쇼츠 댓글 리스트
export const ShortsCommentService = async (shorts_id, offset, limit) => {
    
    const exists = await shortsDao.doesShortExistDao(shorts_id);
    if (!exists) {
        throw new BaseError(status.SHORTS_NOT_FOUND);
    }

    const shortsComments = await shortsDao.getShortsComments(shorts_id, offset, limit);
    const shortsCommentsDTOList = [];

    for (const comments of shortsComments) {
        let result = shortsCommentsResponseDTO(comments);
        shortsCommentsDTOList.push(result);
    }

    return shortsCommentsDTOList;
}