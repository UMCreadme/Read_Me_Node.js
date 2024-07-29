import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { createCommunityService } from './communities.service.js';

export const createCommunityController = async (req, res, next) => {
    const { userId, bookId, address, tag, capacity } = req.body;

    // 누락된 파라미터 확인
    const missingParams = [];
    if (!userId) missingParams.push('userId');
    if (!bookId) missingParams.push('bookId');
    if (!address) missingParams.push('address');
    if (!capacity) missingParams.push('capacity');

    // 누락된 정보가 있을 경우
    if (missingParams.length > 0) {
        return res.status(status.BAD_REQUEST.status).send(response(
            status.BAD_REQUEST,
            "",
            `필요한 정보가 누락되었습니다: ${missingParams.join(', ')}`
        ));
    }

    try {
        // 커뮤니티 생성 및 DTO 반환
        const communityData = await createCommunityService(userId, bookId, address, tag, capacity);

        // 성공 응답 전송
        res.status(status.SUCCESS.status).send(response(
            status.SUCCESS,
            communityData,
            "커뮤니티 개설 성공"
        ));
    } catch (error) {
        // 에러를 에러 처리 미들웨어로 전달
        next(error);
    }
};
