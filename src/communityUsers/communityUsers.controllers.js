import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { joinCommunityService } from './communityUsers.service.js';
import { JoinCommunityDTO } from './communityUsers.dto.js';

export const joinCommunityController = async (req, res, next) => {
    try {
        const { community_id } = req.body; // community_id는 요청 본문에서 받음
        const user_id = req.user.id; // 미들웨어에서 설정된 사용자 ID 사용

        if (!community_id) {
            return res.status(status.BAD_REQUEST.status).send(response(
                status.BAD_REQUEST,
                null,
                "필요한 정보가 누락되었습니다: community_id"
            ));
        }

        const joinCommunityDTO = new JoinCommunityDTO(community_id, user_id);
        const result = await joinCommunityService(joinCommunityDTO);

        res.status(status.SUCCESS.status).send(response(
            status.SUCCESS,
            {
                groupId: result.community_id,
                userId: result.user_id,
                joinedAt: new Date().toISOString() // 참여 일자
            },
            "모임 참여 성공"
        ));
    } catch (error) {
        console.error('Controller error:', error.message);

        let errorMessage = '서버에서 문제가 발생했습니다. 나중에 다시 시도해주세요.';
        let statusCode = status.INTERNAL_SERVER_ERROR.status;

        if (error.message.includes('User already in the community')) {
            errorMessage = '이미 이 커뮤니티에 참여 중입니다.';
            statusCode = status.BAD_REQUEST.status;
        } else if (error.message.includes('Community has reached its capacity')) {
            errorMessage = '참여 인원 초과로 참여하실 수 없습니다.';
            statusCode = status.BAD_REQUEST.status;
        }

        res.status(statusCode).send(response(
            {
                ...status.INTERNAL_SERVER_ERROR,
                status: statusCode,
            },
            null,
            errorMessage
        ));
    }
};
