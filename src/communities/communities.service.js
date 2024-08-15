import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';

import {
    getCommunities,
    getMyCommunities,
    createCommunity,
    getCommunityCurrentCount,
    getUnreadCnt,
    getCommunityBookInfo,
    getCommunityCapacity,
    isUserAlreadyInCommunity,
    searchCommunitiesByTagKeyword,
    searchCommunitiesByTitleKeyword,
    joinCommunity,
    deleteCommunityDao,
    checkCommunityExistenceDao,
    checkCommunityOwnerDao,
} from './communities.dao.js';
import { communitiesInfoDTO, mycommunitiesInfoDTO, getCommunitiesDto } from './communities.dto.js';
import { getBookIdByISBN, getCategoryIdByAladinCid } from "../book/book.dao.js";
import { createBook } from "../book/book.service.js";
import { pageInfo } from '../../config/pageInfo.js';

// 커뮤니티 생성 서비스
export const createCommunityService = async (book, community, cid) => {
    // ISBN 값으로 book_id 조회
    let bookId = await getBookIdByISBN(book.ISBN);
    
    // book_id 값이 존재하지 않을 경우 책 정보 생성
    if(!bookId) {
        const categoryId = await getCategoryIdByAladinCid(cid);
        if(!categoryId) {
            throw new BaseError(status.CATEGORY_NOT_FOUND);
        }

        book.category_id = categoryId;
        bookId = await createBook(book);
    }
    
    // Capacity 값이 4 이상, 10 이하인지 체크
    if (community.capacity > 10 || community.capacity < 4) {
        throw new BaseError(status.INVALID_CAPACITY);
    }

    // 태그 유효성 검사
    if (community.tag) {

        // 태그 문자열을 '|'로 분리하여 배열로 변환
        const tagsArray = community.tag.split('|');

        // 태그 개수가 10개를 초과하면 오류 발생
        if (tagsArray.length > 10) {
            throw new BaseError(status.SHORTS_TAG_COUNT_TOO_LONG);
        }

        // 각 태그의 길이가 10자를 초과하면 오류 발생
        for (const singleTag of tagsArray) {
            if (singleTag.length > 10) {
                throw new BaseError(status.SHORTS_TAG_TOO_LONG);
            }
        }
    }

    // 모임 생성
    return await createCommunity(community, bookId);
};

// 커뮤니티 가입 서비스
export const joinCommunityService = async (communityId, userId) => { 
    const userInCommunity = await isUserAlreadyInCommunity(communityId, userId); 
    if (userInCommunity) {
        throw new BaseError(status.ALREADY_IN_COMMUNITY);
    }

    const currentCount = await getCommunityCurrentCount(communityId);
    const capacity = await getCommunityCapacity(communityId);

    if (currentCount >= capacity) {
        throw new BaseError(status.COMMUNITY_FULL);
    }

    await joinCommunity(communityId, userId);
};

// 전체 모임 리스트 조회
export const getCommunitiesService = async (offset, limit) => {
    
    const allCommunities = await getCommunities(offset, limit);
    const allCommunitiesDTOList = [];
    
    for (const c of allCommunities) {
        //현재 참여자수
        let currentCount = await getCommunityCurrentCount(c.community_id);
        
        // 모임 책 정보
        let communityBook = await getCommunityBookInfo(c.community_id);
        let result = communitiesInfoDTO(c, communityBook, currentCount);
        allCommunitiesDTOList.push(result);
    }

    return allCommunitiesDTOList
};

// 나의 참여 모임 리스트 조회
export const getMyCommunitiesService = async (myId, offset, limit) => {
    
    const myCommunities = await getMyCommunities(myId, offset, limit);
    const myCommunitiesDTOList = [];

    for (const c of myCommunities) {
        //현재 참여자수
        let currentCount = await getCommunityCurrentCount(c.community_id);
        
        // 모임 책 정보
        let communityBook = await getCommunityBookInfo(c.community_id);

        // 안읽음 개수
        let unreadCnt = await getUnreadCnt(c.community_id, myId);
        unreadCnt = Number(unreadCnt.unread);
        
        let result = mycommunitiesInfoDTO(c, communityBook, currentCount, unreadCnt);
        myCommunitiesDTOList.push(result);
    }

    return myCommunitiesDTOList
};

// 커뮤니티 검색 서비스
export const searchCommunityService = async (keyword, page = 1, size = 10) => {
    // 파라미터 검증
    if (!keyword || page <= 0 || size <= 0 || keyword.trim() === "") {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    let communities;
    const decodedKeyword = decodeURIComponent(keyword.trim().replace(/\s+/g, '')); // URL 디코딩 및 공백 제거
    const isTagSearch = decodedKeyword.startsWith('#');

    if (isTagSearch) {
        // 태그 검색
        const formattedKeyword = decodedKeyword.substring(1); 
        communities = await searchCommunitiesByTagKeyword(formattedKeyword);
    } else {
        // 제목 검색
        communities = await searchCommunitiesByTitleKeyword(decodedKeyword);
    }

    // 페이지네이션 계산
    const offset = (page - 1) * size;
    const limit = size + 1; // 요청한 size보다 하나 더 조회
    const paginatedCommunities = communities.slice(offset, offset + limit);
    const hasNext = paginatedCommunities.length > size;
    const actualSize = hasNext ? size : paginatedCommunities.length;

    return {
        communityList: getCommunitiesDto({ communities: paginatedCommunities.slice(0, actualSize) }),
        pageInfo: pageInfo(page, actualSize, hasNext, communities.length)
    };
};

export const deleteCommunityService = async (user_id, community_id) => {
    const exists = await checkCommunityExistenceDao(community_id);
    if (!exists) {
        throw new BaseError(status.COMMUNITY_NOT_FOUND);
    }

    const owner = await checkCommunityOwnerDao(community_id);
    if (owner !== user_id) {
        throw new BaseError(status.UNAUTHORIZED);
    }

    await deleteCommunityDao(community_id);
};