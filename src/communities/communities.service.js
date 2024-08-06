import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import {
    getCommunities,
    createCommunityWithCheck,
    getCommunityCurrentCount,
    getCommunityCapacity,
    isUserAlreadyInCommunity,
    searchCommunitiesByTagKeyword,
    searchCommunitiesByTitleKeyword,
    joinCommunity
} from './communities.dao.js';
import { getCommunitiesDto } from './communities.dto.js';
import { pageInfo } from '../../config/pageInfo.js';

// 커뮤니티 생성 서비스
export const createCommunityService = async (userId, bookId, address, tag, capacity) => {
    // Capacity 값이 10을 초과하는지 체크
    if (capacity > 10) {
        throw new BaseError(status.INVALID_CAPACITY);
    }

    // 태그 유효성 검사
    if (tag) {

        // 태그 문자열을 '|'로 분리하여 배열로 변환
        const tagsArray = tag.split('|');

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

    // 커뮤니티 생성과 관련된 전체 과정 처리
    await createCommunityWithCheck(userId, bookId, address, tag, capacity);
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
export const getCommunitiesService = async (page, size) => {
    const { communities, totalElements } = await getCommunities(page, size);

    // 페이지 정보를 계산
    const hasNext = communities.length > size;
    const actualSize = hasNext ? size : communities.length;
    const communityList = communities.slice(0, actualSize);

    return {
        communityList: getCommunitiesDto({ communities: communityList }),
        pageInfo: pageInfo(page, actualSize, hasNext, totalElements)
    };
};

// 커뮤니티 검색 서비스
export const searchCommunityService = async (keyword, page = 1, size = 10) => {
    // 파라미터 검증
    if (!keyword || page <= 0 || size <= 0) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    let communities;
    const decodedKeyword = decodeURIComponent(keyword.trim()); // URL 디코딩
    const isTagSearch = decodedKeyword.startsWith('#');

    if (isTagSearch) {
        // 태그 검색
        const formattedKeyword = decodedKeyword.startsWith('#') ? decodedKeyword.substring(1) : decodedKeyword; // #을 제거
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
