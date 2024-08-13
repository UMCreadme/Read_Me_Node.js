import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import {
    deleteCommunityDao,
    checkCommunityExistenceDao,
    checkCommunityOwnerDao,
    getCommunities,
    createCommunityWithCheck,
    getCommunityCurrentCountDao,
    getCommunityCapacityDao,
    joinCommunity,
    checkUserInCommunity,
    rejoinCommunity,
    leaveCommunityDao,
    getCommunityDetailsDao
} from './communities.dao.js';
import { getCommunitiesDto,getCommunityDetailsDto } from './communities.dto.js';
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

//커뮤니티 가입 서비스스
export const joinCommunityService = async (communityId, userId) => { 
    // 유저가 커뮤니티에 이미 존재하는지 확인하고 is_deleted 상태 반환
    const userStatus = await checkUserInCommunity(communityId, userId);

    if (userStatus === null) {
        // 디비에 유저 정보가 없으면 새로 가입 처리
        await joinCommunity(communityId, userId);
    } else if (userStatus === 1) {
        // 유저가 탈퇴한 경우, 재가입 처리
        await rejoinCommunity(communityId, userId);
    } else {
        // 유저가 이미 가입되어 있는 경우 오류 발생
        throw new BaseError(status.ALREADY_IN_COMMUNITY);
    }

    // 커뮤니티의 현재 인원수 및 최대 인원수 조회
    const currentCount = await getCommunityCurrentCountDao(communityId);
    const capacity = await getCommunityCapacityDao(communityId);

    // 현재 인원수가 최대 인원수를 초과하면 오류 발생
    if (currentCount >= capacity) {
        throw new BaseError(status.COMMUNITY_FULL);
    }
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


// 커뮤니티 탈퇴 서비스
export const leaveCommunityService = async (communityId, userId) => {
    // 유저가 커뮤니티에 존재하는지 확인
    const userStatus = await checkUserInCommunity(communityId, userId);

    if (userStatus === null) {
        // 유저가 커뮤니티에 가입되어 있지 않은 경우
        throw new BaseError(status.NOT_IN_COMMUNITY);
    } else if (userStatus === 1) {
        // 유저가 이미 탈퇴한 경우
        throw new BaseError(status.ALREADY_LEFT_COMMUNITY);
    }

    // 유저 탈퇴 처리 (소프트 딜리트 및 삭제 시간 기록)
    await leaveCommunityDao(communityId, userId);
};

// 커뮤니티 상세정보를 가져오는 서비스 함수
export const getCommunityDetailsService = async (communityId) => {
    try {
        // DAO를 통해 데이터베이스에서 커뮤니티 정보를 가져옴
        const communityData = await getCommunityDetailsDao(communityId);

        // 커뮤니티 정보가 없으면 에러를 던짐
        if (!communityData || communityData.length === 0) {
            throw new BaseError(status.COMMUNITY_NOT_FOUND);
        }

        // DTO를 통해 데이터를 변환하여 반환
        return getCommunityDetailsDto(communityData);
    } catch (error) {
        console.error(error);
        throw error;
    }
};