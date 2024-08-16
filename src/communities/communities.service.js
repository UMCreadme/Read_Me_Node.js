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
    isPossibleCreateCommunity,
} from './communities.dao.js';
import { communitiesInfoDTO, mycommunitiesInfoDTO } from './communities.dto.js';

// 커뮤니티 생성 서비스
export const createCommunityService = async (community) => {
    // Capacity 값이 4 이상, 10 이하인지 체크
    if (community.capacity > 10 || community.capacity < 4) {
        throw new BaseError(status.INVALID_CAPACITY);
    }

    // 태그 유효성 검사
    const communityTagList = community.tag.split('|');
    if (communityTagList) {
        // 태그 개수가 10개를 초과하면 오류 발생
        if (communityTagList.length > 10) {
            throw new BaseError(status.SHORTS_TAG_COUNT_TOO_LONG);
        }

        // 각 태그의 길이가 10자를 초과하면 오류 발생
        for (const singleTag of communityTagList) {
            if (singleTag.length > 10) {
                throw new BaseError(status.SHORTS_TAG_TOO_LONG);
            }
        }
    }

    // 방장이 모임 생성 가능한지 확인
    if(!isPossibleCreateCommunity(community.user_id, community.book_id)) {
        throw new BaseError(status.COMMUNITY_LIMIT_EXCEEDED);
    }

    // 모임 생성
    return await createCommunity(community);
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
export const searchCommunityService = async (keyword, offset, limit) => {
    
    // 키워드 디코딩 및 공백 제거
    const decodedKeyword = decodeURIComponent(keyword.trim().replace(/\s+/g, ''));
    const isTagSearch = decodedKeyword.startsWith('#');

    // 태그 또는 제목 검색
    const searchCommunities = isTagSearch 
        ? await searchCommunitiesByTagKeyword(decodedKeyword.substring(1)) // 태그 검색 ('#은 제거')
        : await searchCommunitiesByTitleKeyword(decodedKeyword); // 제목 검색

    const searchCommunitiesDTOList = [];

    for (const c of searchCommunities) {

        //현재 참여자수
        let currentCount = await getCommunityCurrentCount(c.community_id);
                
        // 모임 책 정보
        let communityBook = await getCommunityBookInfo(c.community_id);

        let result = communitiesInfoDTO(c, communityBook, currentCount);
        searchCommunitiesDTOList.push(result);
    }

    return searchCommunitiesDTOList; // 결과 리스트 반환
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