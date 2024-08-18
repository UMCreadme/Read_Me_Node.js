import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';

import {
    deleteCommunityDao,
    checkCommunityExistenceDao,
    checkCommunityOwnerDao,
    getCommunities,
    getCommunityCurrentCountDao,
    getCommunityCapacityDao,
    joinCommunity,
    checkUserInCommunity,
    rejoinCommunity,
    leaveCommunityDao,
    getCommunityDetailsDao,
    getChatroomDetailsDao,
    updateMeetingDetailsDao,
    getCommunityUpdatedAtDao,
    searchCommunitiesByTagKeyword,
    searchCommunitiesByTitleKeyword,
    checkIfLeaderDao,
    getMyCommunities,
    createCommunity,
    isUserAlreadyInCommunity,
    deleteCommunityDao,
    checkCommunityExistenceDao,
    checkCommunityOwnerDao,
    isPossibleCreateCommunity,
} from './communities.dao.js';
import { getCommunitiesDto, getCommunityDetailsDto, getChatroomDetailsDto, communitiesInfoDTO, mycommunitiesInfoDTO } from './communities.dto.js';
import { pageInfo } from '../../config/pageInfo.js';


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

//커뮤니티 가입 서비스
export const joinCommunityService = async (communityId, userId) => {
    // 유저가 커뮤니티에 이미 존재하는지 확인하고 is_deleted 상태 반환
    const userStatus = await checkUserInCommunity(communityId, userId);
    // 커뮤니티의 현재 인원수 및 최대 인원수 조회
    const currentCount = await getCommunityCurrentCountDao(communityId);

    // 현재 인원수가 최대 인원수를 초과하면 오류 발생
    const capacity = await getCommunityCapacityDao(communityId);
    if (currentCount >= capacity) {
        throw new BaseError(status.COMMUNITY_FULL);
    }
    if (userStatus === null) {
        // 디비에 유저 정보가 없으면 새로 가입 처리
        await joinCommunity(communityId, userId);
    } else if (userStatus) {
        // 유저가 탈퇴한 경우, 재가입 처리
        await rejoinCommunity(communityId, userId);
    } else {
        // 유저가 이미 가입되어 있는 경우 오류 발생
        throw new BaseError(status.ALREADY_IN_COMMUNITY);
    }

};

// 전체 모임 리스트 조회
export const getCommunitiesService = async (offset, limit) => {
    const allCommunities = await getCommunities(offset, limit);

    // DTO 내부 로직으로 처리
    const allCommunitiesDTOList = allCommunities.map(c => communitiesInfoDTO(c));

    return allCommunitiesDTOList;
};

// 나의 참여 모임 리스트 조회
export const getMyCommunitiesService = async (myId, offset, limit) => {
    const myCommunities = await getMyCommunities(myId, offset, limit);

    // DTO 내부 로직으로 처리
    const myCommunitiesDTOList = myCommunities.map(c => mycommunitiesInfoDTO(c));

    return myCommunitiesDTOList;
};

// 커뮤니티 검색 서비스
export const searchCommunityService = async (keyword, offset, limit) => {
    
    // 키워드 디코딩 및 공백 제거
    const decodedKeyword = decodeURIComponent(keyword.trim().replace(/\s+/g, ''));
    const isTagSearch = decodedKeyword.startsWith('#');

    // 태그 또는 제목 검색
    const searchCommunities = isTagSearch 
        ? await searchCommunitiesByTagKeyword(decodedKeyword.substring(1), offset, limit) // 태그 검색 ('#은 제거')
        : await searchCommunitiesByTitleKeyword(decodedKeyword, offset, limit); // 제목 검색

    // DTO 내부 로직으로 처리
    const searchCommunitiesDTOList = searchCommunities.map(c => communitiesInfoDTO(c));

    return searchCommunitiesDTOList; // 결과 리스트 반환
};

    // DTO 내부 로직으로 처리
    const searchCommunitiesDTOList = searchCommunities.map(c => communitiesInfoDTO(c));

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
  
export const leaveCommunityService = async (communityId, userId) => {
    // 유저가 커뮤니티에 존재하는지 확인
    const userStatus = await checkUserInCommunity(communityId, userId);

    if (userStatus === null || userStatus) {
        throw new BaseError(status.NOT_IN_COMMUNITY);
    }

    // 유저가 방장인지 확인
    const isLeader = await checkIfLeaderDao(communityId, userId);
    if (isLeader) {
        // 방장은 탈퇴할 수 없음
        throw new BaseError(status.LEADER_CANNOT_LEAVE);
    }

    // 유저 탈퇴 처리 (소프트 딜리트 및 삭제 시간 기록)
    await leaveCommunityDao(communityId, userId);
};

// 커뮤니티 상세정보를 가져오는 서비스 함수
export const getCommunityDetailsService = async (communityId, userId) => {
    const communityData = await getCommunityDetailsDao(communityId);
    let isUserParticipating = false;


    if (!communityData || communityData.length === 0) {
        throw new BaseError(status.COMMUNITY_NOT_FOUND);
    }

    if (userId !== null) {
        isUserParticipating = await checkUserInCommunity(communityId, userId);
    }
    return getCommunityDetailsDto(communityData, isUserParticipating);
};

export const getChatroomDetailsService = async (communityId, currentUserId) => {
    // 유저가 커뮤니티에 속해 있는지 확인
    const userStatus = await checkUserInCommunity(communityId, currentUserId);

    if (userStatus === null || userStatus === 1) {
        // 유저가 커뮤니티에 가입되어 있지 않거나 이미 탈퇴한 경우
        throw new BaseError(status.UNAUTHORIZED);
    }

    // 커뮤니티 데이터 가져오기
    const { communityData, membersData } = await getChatroomDetailsDao(communityId);
    if (!communityData || communityData.length === 0) {
        throw new BaseError(status.NOT_FOUND);
    }

    return getChatroomDetailsDto(communityData, membersData, currentUserId);
};


export const updateMeetingDetailsService = async (communityId, meetingDate, latitude, longitude, address, userId) => {

    const exists = await checkCommunityExistenceDao(communityId);
    if (!exists) {
        throw new BaseError(status.COMMUNITY_NOT_FOUND);
    }

    const communityUpdatedAt = await getCommunityUpdatedAtDao(communityId);
    const updatedAtDate = new Date(communityUpdatedAt);
    const meetingDateDate = new Date(meetingDate);
    const thirtyMinutesInMs = 30 * 60 * 1000;
    const minAllowedMeetingDate = new Date(updatedAtDate.getTime() + thirtyMinutesInMs);

    if (meetingDateDate < minAllowedMeetingDate) {
        throw new BaseError(status.INVALID_MEETING_DATE);
    }


    await updateMeetingDetailsDao(communityId, meetingDate, latitude, longitude, address, userId);
};
