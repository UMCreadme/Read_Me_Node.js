// communities.controllers.js
import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { joinCommunityService } from './communities.service.js';
import { JoinCommunityDTO } from './communities.dto.js';

// 커뮤니티 가입 컨트롤러
export const joinCommunityController = async (req, res, next) => {
    const { community_id } = req.params; // community_id는 요청 경로에서 받음!
    const user_id = req.user.id; // 미들웨어에서 설정된 사용자 ID 사용

    if (!community_id) {
        return res.send(response(status.PARAMETER_IS_WRONG));
    }

    const joinCommunityDTO = new JoinCommunityDTO(community_id, user_id);
    await joinCommunityService(joinCommunityDTO);

    return res.send(response(status.JOINED));
};
