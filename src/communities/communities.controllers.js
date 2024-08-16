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

    const result = await getCommunitiesService(page, size);

    res.send(response(status.SUCCESS, result.communityList, result.pageInfo))
};

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

export const updateMeetingDetailsController = async (req, res, next) => {
    const { meetingDate, latitude, longitude, address } = req.body;
    const communityId = parseInt(req.params.communityId);
    const userId = req.user_id;

    if (!meetingDate || !latitude || !longitude || !address) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
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
    const { keyword, page = 1, size = 10 } = req.query;
    const result = await searchCommunityService(keyword, page, size);

    res.send(response(status.SUCCESS, result.communityList, result.pageInfo))
};

