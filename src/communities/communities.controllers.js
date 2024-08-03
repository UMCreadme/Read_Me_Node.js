import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { createCommunityService } from './communities.service.js';
import { getCommunitiesService } from './communities.service.js';


export const createCommunityController = async (req, res, next) => {
    const { userId, bookId, address, tag, capacity, createdAT, updatedAt  } = req.body;

    // 누락된 파라미터 확인
    const missingParams = [];
    if (!userId) missingParams.push('userId');
    if (!bookId) missingParams.push('bookId');
    if (!address) missingParams.push('address');
    if (!capacity) missingParams.push('capacity');

    // 누락된 정보가 있을 경우
    if (missingParams.length > 0) {
        return res.status(400).send({
            isSuccess: false,
            code: "COMMON001",
            message: `필요한 정보가 누락되었습니다: ${missingParams.join(', ')}`
        });
    }

    try {
        // 커뮤니티 생성 및 DTO 반환
        const communityData = await createCommunityService(userId, bookId, address, tag, capacity, createdAT, updatedAt );

        // 성공 응답 전송
        res.status(status.CREATED.status).send(response(
            status.CREATED,
            { community: communityData }
        ));
    } catch (error) {
        next(error);
    }}


export const getCommunitiesController = async (req, res, next) => {
    const { page = 1, size = 10 } = req.query;  // req.body 대신 req.query 사용

    try {
        const communitiesData = await getCommunitiesService(parseInt(page), parseInt(size));

        res.status(status.SUCCESS.status).send(response(
            status.SUCCESS,
            communitiesData,
            "전체 모임 리스트 불러오기 성공"
        ));
    } catch (error) {
        next(error);
    }
};
