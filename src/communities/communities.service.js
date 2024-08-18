import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import * as dao from './communities.dao.js';
import { getCommunityDetailsDto, getChatroomDetailsDto, communitiesInfoDTO, mycommunitiesInfoDTO } from './communities.dto.js';


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
    if(!dao.isPossibleCreateCommunity(community.user_id, community.book_id)) {
        throw new BaseError(status.COMMUNITY_LIMIT_EXCEEDED);
    }

    // 모임 생성
    return await dao.createCommunity(community);
};

//커뮤니티 가입 서비스
export const joinCommunityService = async (communityId, userId) => {
    // 유저가 커뮤니티에 이미 존재하는지 확인하고 is_deleted 상태 반환
    const userStatus = await dao.checkUserInCommunity(communityId, userId);
    // 커뮤니티의 현재 인원수 및 최대 인원수 조회
    const currentCount = await dao.getCommunityCurrentCountDao(communityId);

    // 현재 인원수가 최대 인원수를 초과하면 오류 발생
    const capacity = await dao.getCommunityCapacityDao(communityId);
    if (currentCount >= capacity) {
        throw new BaseError(status.COMMUNITY_FULL);
    }
    if (userStatus === null) {
        // 디비에 유저 정보가 없으면 새로 가입 처리
        await dao.joinCommunity(communityId, userId);
    } else if (userStatus) {
        // 유저가 탈퇴한 경우, 재가입 처리
        await dao.rejoinCommunity(communityId, userId);
    } else {
        // 유저가 이미 가입되어 있는 경우 오류 발생
        throw new BaseError(status.ALREADY_IN_COMMUNITY);
    }

};

// 전체 모임 리스트 조회
export const getCommunitiesService = async (offset, limit) => {
    const allCommunities = await dao.getCommunities(offset, limit);

    // DTO 내부 로직으로 처리
    const allCommunitiesDTOList = allCommunities.map(c => communitiesInfoDTO(c));

    return allCommunitiesDTOList;
};

// 나의 참여 모임 리스트 조회
export const getMyCommunitiesService = async (myId, offset, limit) => {
    const myCommunities = await dao.getMyCommunities(myId, offset, limit);

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
        ? await dao.searchCommunitiesByTagKeyword(decodedKeyword.substring(1), offset, limit) // 태그 검색 ('#은 제거')
        : await dao.searchCommunitiesByTitleKeyword(decodedKeyword, offset, limit); // 제목 검색

    // DTO 내부 로직으로 처리
    const searchCommunitiesDTOList = searchCommunities.map(c => communitiesInfoDTO(c));

    return searchCommunitiesDTOList; // 결과 리스트 반환
};

// 커뮤니티 삭제
export const deleteCommunityService = async (user_id, community_id) => {
    const exists = await dao.checkCommunityExistenceDao(community_id);
    if (!exists) {
        throw new BaseError(status.COMMUNITY_NOT_FOUND);
    }

    const owner = await dao.checkCommunityOwnerDao(community_id);
    if (owner !== user_id) {
        throw new BaseError(status.UNAUTHORIZED);
    }

    await dao.deleteCommunityDao(community_id);
};

export const leaveCommunityService = async (communityId, userId) => {
    // 유저가 커뮤니티에 존재하는지 확인
    const userStatus = await dao.checkUserInCommunity(communityId, userId);

    if (userStatus === null || userStatus) {
        throw new BaseError(status.NOT_IN_COMMUNITY);
    }

    // 유저가 방장인지 확인
    const isLeader = await dao.checkIfLeaderDao(communityId, userId);
    if (isLeader) {
        // 방장은 탈퇴할 수 없음
        throw new BaseError(status.LEADER_CANNOT_LEAVE);
    }

    // 유저 탈퇴 처리 (소프트 딜리트 및 삭제 시간 기록)
    await dao.leaveCommunityDao(communityId, userId);
};

// 커뮤니티 상세정보를 가져오는 서비스 함수
export const getCommunityDetailsService = async (communityId, userId) => {
    const communityData = await dao.getCommunityDetailsDao(communityId);
    let isUserParticipating = false;


    if (!communityData || communityData.length === 0) {
        throw new BaseError(status.COMMUNITY_NOT_FOUND);
    }

    if (userId !== null) {
        isUserParticipating = await checkUserInCommunity(communityId, userId);
    }
    return getCommunityDetailsDto(communityData, isUserParticipating);
};

// 채팅방 상세 조회
export const getChatroomDetailsService = async (communityId, currentUserId) => {
    // 유저가 커뮤니티에 속해 있는지 확인
    const userStatus = await dao.checkUserInCommunity(communityId, currentUserId);

    if (userStatus === null || userStatus === 1) {
        // 유저가 커뮤니티에 가입되어 있지 않거나 이미 탈퇴한 경우
        throw new BaseError(status.UNAUTHORIZED);
    }

    // 커뮤니티 데이터 가져오기
    const { communityData, membersData } = await dao.getChatroomDetailsDao(communityId);
    if (!communityData || communityData.length === 0) {
        throw new BaseError(status.NOT_FOUND);
    }

    return getChatroomDetailsDto(communityData, membersData, currentUserId);
};

// 약속 설정
export const updateMeetingDetailsService = async (communityId, meetingDate, latitude, longitude, address, userId) => {

    const exists = await dao.checkCommunityExistenceDao(communityId);
    if (!exists) {
        throw new BaseError(status.COMMUNITY_NOT_FOUND);
    }

    const communityUpdatedAt = await dao.getCommunityUpdatedAtDao(communityId);
    const updatedAtDate = new Date(communityUpdatedAt);
    const meetingDateDate = new Date(meetingDate);
    const thirtyMinutesInMs = 30 * 60 * 1000;
    const minAllowedMeetingDate = new Date(updatedAtDate.getTime() + thirtyMinutesInMs);

    if (meetingDateDate < minAllowedMeetingDate) {
        throw new BaseError(status.INVALID_MEETING_DATE);
    }

    await dao.updateMeetingDetailsDao(communityId, meetingDate, latitude, longitude, address, userId);
};
