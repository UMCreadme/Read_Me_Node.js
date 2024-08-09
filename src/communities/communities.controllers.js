import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import {deleteCommunityService, createCommunityService } from './communities.service.js';


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
    const user_id  = req.user_id;
    const community_id = req.params.communityId;

    if (!user_id || !community_id) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
  
    await deleteCommunityService(user_id, community_id);
    res.send(response(status.SUCCESS));
}