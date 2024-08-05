// communities.controllers.js
import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { joinCommunityService } from './communities.service.js';
import { BaseError } from '../../config/error.js';

// 커뮤니티 가입 컨트롤러
export const joinCommunityController = async (req, res, next) => {
    const communityId = req.params.communityId; 
    const userId = req.user_id; 

    if (!communityId) {
        return next(new BaseError(status.PARAMETER_IS_WRONG)); 
    }

    try {
        await joinCommunityService(communityId, userId);
        return res.send(response(status.JOINED));
    } catch (error) {
        next(error); 
    }
};
