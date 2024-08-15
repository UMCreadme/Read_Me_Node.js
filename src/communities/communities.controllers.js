import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import {
    deleteCommunityService,
    createCommunityService,
    joinCommunityService,
    getCommunitiesService,
    leaveCommunityService,
    getCommunityDetailsService,
    getChatroomDetailsService,
    updateMeetingDetailsService
} from './communities.service.js';


// 커뮤니티 생성
export const createCommunityController = async (req, res, next) => {
    const userId = req.user_id;
    const { bookId, address, tag, capacity } = req.body;

    // 누락된 파라미터 확인
    const missingParams = [];
    if (!userId) missingParams.push('userId');
    if (!bookId) missingParams.push('bookId');
    if (!address) missingParams.push('address');
    if (!capacity) missingParams.push('capacity');

    // 누락된 정보가 있을 경우
    if (missingParams.length > 0) {
        return next(new BaseError(status.PARAMETER_IS_WRONG));
    }

    await createCommunityService(userId, bookId, address, tag, capacity);

    // 성공 응답 전송
    res.send(response(status.CREATED));
};


export const deleteCommunityController = async (req, res, next) => {
    const user_id = req.user_id;
    const community_id = req.params.communityId;

    if (!user_id || !community_id) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await deleteCommunityService(user_id, community_id);
    res.send(response(status.SUCCESS));
}

// 커뮤니티 가입 컨트롤러
export const joinCommunityController = async (req, res, next) => {
    const communityId = req.params.communityId;
    const userId = req.user_id;

    if (!communityId) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await joinCommunityService(parseInt(communityId), userId);
    return res.send(response(status.JOINED));

};

export const getCommunitiesController = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const { communityList, pageInfo } = await getCommunitiesService(page, size);

    res.status(status.SUCCESS.status).send({
        isSuccess: true,
        code: status.SUCCESS.code,
        message: "전체 모임 리스트 불러오기 성공",
        pageInfo: pageInfo,
        result: communityList
    });
};

// 커뮤니티 탈퇴
export const leaveCommunityController = async (req, res, next) => {
    const userId = req.user_id;
    const communityId = req.params.communityId;

    if (!userId || !communityId) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await leaveCommunityService(communityId, userId);
    return res.send(response(status.SUCCESS));
};

// 커뮤니티 상세정보 조회
export const getCommunityDetailsController = async (req, res, next) => {
    const { communityId } = req.params;
    const userId = req.user_id;

    const communityDetails = await getCommunityDetailsService(communityId, userId);
    return res.send(response(status.SUCCESS, communityDetails));
};

// 채팅방 상세정보 조회
export const getChatroomDetailsController = async (req, res, next) => {
    const userId = req.user_id;
    const { communityId } = req.params;


    const detailedCommunityDetails = await getChatroomDetailsService(communityId, userId);
    return res.send(response(status.SUCCESS, detailedCommunityDetails));
};

import asyncHandler from 'express-async-handler';

export const updateMeetingDetailsController = asyncHandler(async (req, res) => {
    const { meetingDate, latitude, longitude, address } = req.body;
    const communityId = req.params.communityId;
    const userId = req.user_id;

    if (!meetingDate || !latitude || !longitude || !address) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    console.log('Received request to update meeting details:', { communityId, meetingDate, latitude, longitude, address, userId });

    // 서비스 호출
    await updateMeetingDetailsService(
        communityId,
        meetingDate,
        latitude,
        longitude,
        address,
        userId
    );

    // 성공 시 응답
    res.send(response(status.SUCCESS));
});