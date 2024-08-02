import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { joinCommunityService } from './communities.service.js';
import { JoinCommunityDTO } from './communities.dto.js';

// 커뮤니티 가입 컨트롤러
export const joinCommunityController = async (req, res, next) => {
    try {
        const { community_id } = req.body; // community_id는 요청 본문에서 받음
        const user_id = req.user.id; // 미들웨어에서 설정된 사용자 ID 사용

        if (!community_id) {
            return res.status(status.BAD_REQUEST.status).send(response(
                status.BAD_REQUEST,
                null,
                `필요한 정보가 누락되었습니다: ${status.BAD_REQUEST.message}`
            ));
        }

        const joinCommunityDTO = new JoinCommunityDTO(community_id, user_id);
        const result = await joinCommunityService(joinCommunityDTO);

        // 성공 응답
        res.status(status.JOINED.status).send(response(
            status.JOINED,
            {
                communityId: result.communityId,
                userId: result.userId,
                joinedAt: result.joinedAt // 참여 일자
            }
        ));
    } catch (error) {
        console.error('Controller error:', error.message);

        let errorMessage = status.INTERNAL_SERVER_ERROR.message; // 기본 에러 메시지
        let statusCode = status.INTERNAL_SERVER_ERROR.status; // 기본 상태 코드
        let errorCode = status.INTERNAL_SERVER_ERROR.code; // 기본 에러 코드

        if (error.message.includes('User already in the community')) {
            errorMessage = `이미 이 커뮤니티에 참여 중입니다. (${status.BAD_REQUEST.message})`;
            statusCode = status.BAD_REQUEST.status;
            errorCode = status.BAD_REQUEST.code;
        } else if (error.message.includes('Community has reached its capacity')) {
            errorMessage = `참여 인원 초과로 참여하실 수 없습니다. (${status.BAD_REQUEST.message})`;
            statusCode = status.BAD_REQUEST.status;
            errorCode = status.BAD_REQUEST.code;
        }

        // 에러 응답
        res.status(statusCode).send(response(
            {
                isSuccess: false,
                code: errorCode,
                message: errorMessage
            }

        ));
    }
};
