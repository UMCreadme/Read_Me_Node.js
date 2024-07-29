import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { getCommunitiesService } from './communities.service.js';

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
