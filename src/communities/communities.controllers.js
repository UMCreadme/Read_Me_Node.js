import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { pageInfo } from "../../config/pageInfo.js";
import { createBook } from "../book/book.service.js";
import { creatCommunityDto } from './communities.dto.js';

import {
    deleteCommunityService,
    createCommunityService,
    searchCommunityService,
    joinCommunityService,
    getCommunitiesService,
    leaveCommunityService,
    getCommunityDetailsService,
    getChatroomDetailsService,
    updateMeetingDetailsService,
    getMyCommunitiesService
} from './communities.service.js';

// 커뮤니티 생성
export const createCommunityController = async (req, res, next) => {
    const ISBN = req.body.ISBN;
    const userId = req.user_id;

    if(!ISBN) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    const bookId = await createBook(req.body.ISBN);
    const community = creatCommunityDto(req.body, userId);
    community.book_id = bookId;

    const communityId = await createCommunityService(community);

    if(!communityId) {
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }

    res.send(response(status.CREATED));
};

export const deleteCommunityController = async (req, res, next) => {
    const user_id = req.user_id;
    const community_id = parseInt(req.params.communityId);

    if (!user_id || !community_id) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await deleteCommunityService(user_id, community_id);
    res.send(response(status.SUCCESS));
}

// 커뮤니티 가입 컨트롤러
export const joinCommunityController = async (req, res, next) => {
    const communityId = parseInt(req.params.communityId);
    const userId = req.user_id;

    if (!communityId) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await joinCommunityService(parseInt(communityId), userId);
    return res.send(response(status.JOINED));

};

// 전체 커뮤니티 리스트 조회
export const getCommunitiesController = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page -1) * size

    const result = await getCommunitiesService(offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

// 나의 모임 리스트 조회
export const getMyCommunitiesController = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page -1) * size

    const myId = req.user_id;

    const result = await getMyCommunitiesService(myId, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();
    
    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

// 커뮤니티 탈퇴
export const leaveCommunityController = async (req, res, next) => {
    const userId = req.user_id;
    const communityId = parseInt(req.params.communityId);

    if (!userId || !communityId) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await leaveCommunityService(communityId, userId);
    return res.send(response(status.SUCCESS));
};

// 커뮤니티 상세정보 조회
export const getCommunityDetailsController = async (req, res, next) => {
    const communityId = parseInt(req.params.communityId);
    const userId = req.user_id;

    const communityDetails = await getCommunityDetailsService(communityId, userId);
    return res.send(response(status.SUCCESS, communityDetails));
};

// 채팅방 상세정보 조회
export const getChatroomDetailsController = async (req, res, next) => {
    const userId = req.user_id;
    const communityId = parseInt(req.params.communityId);


    const detailedCommunityDetails = await getChatroomDetailsService(communityId, userId);
    return res.send(response(status.SUCCESS, detailedCommunityDetails));
};

// 커뮤니티 약속 설정
export const updateMeetingDetailsController = async (req, res, next) => {
    const { meetingDate, latitude, longitude, address } = req.body;
    const communityId = parseInt(req.params.communityId);
    const userId = req.user_id;

    if (!meetingDate || !latitude || !longitude || !address) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    // meetingDate 유효성 체크
    const meetingDatePattern =  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.000Z$/; // YYYY-MM-DD HH:MM:SS 형식
    if (!meetingDatePattern.test(meetingDate)) {
        throw new BaseError(status.DATE_IS_WRONG);
    }

    // latitude, longitude 유효성 체크
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        throw new BaseError(status.POINT_IS_WRONG);
    }

    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        throw new BaseError(status.POINT_IS_WRONG);
    }

    await updateMeetingDetailsService(
        communityId,
        meetingDate,
        latitude,
        longitude,
        address,
        userId
    );

    res.send(response(status.SUCCESS));
};

// 커뮤니티 검색
export const searchCommunityController = async (req, res, next) => {
    const keyword = req.query.keyword;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    // 파라미터 검증
    if (!keyword || page <= 0 || size <= 0 || keyword.trim() === "") {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
    const offset = (page -1) * size
    const result = await searchCommunityService(keyword, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();
    
    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
};

