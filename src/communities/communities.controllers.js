import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { getCommunitiesService, deleteCommunityService } from './communities.service.js';
import { BaseError } from '../../config/error.js';

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

export const deleteCommunityController = async (req, res, next) => {
    const { user_id } = req.user_id;
    const { community_id } = req.params.communityId;

    if (!user_id || community_id) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
    await deleteCommunityService(user_id, community_id);
    res.send(response(status.SUCCESS));
}