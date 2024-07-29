import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { joinCommunityService } from './communityUsers.service.js';
import { JoinCommunityDTO } from './communityUsers.dto.js';

export const joinCommunityController = async (req, res, next) => {
    try {
        const joinCommunityDTO = JoinCommunityDTO.fromQuery(req.query);
        const result = await joinCommunityService(joinCommunityDTO);

        res.status(status.SUCCESS.status).send(response(
            status.SUCCESS,
            result,
            "모임 참여 성공"
        ));
    } catch (error) {
        console.error('Controller error:', error.message); // 터미널에 로그 출력

        // 클라이언트에 반환할 오류 메시지 결정
        let errorMessage = '서버에서 문제가 발생했습니다. 나중에 다시 시도해주세요.';
        let statusCode = status.INTERNAL_SERVER_ERROR.status;

        // 특정 오류 메시지를 클라이언트에 전달
        if (error.message.includes('User already in the community')) {
            errorMessage = '이미 이 커뮤니티에 참여 중입니다.';
            statusCode = status.BAD_REQUEST.status;
        } else if (error.message.includes('Community has reached its capacity')) {
            errorMessage = '이 커뮤니티는 이미 최대 인원수에 도달했습니다.';
            statusCode = status.BAD_REQUEST.status;
        }

        res.status(statusCode).send(response(
            {
                ...status.INTERNAL_SERVER_ERROR, // 사용할 수 있는 상태 객체
                status: statusCode,
            },
            null,
            errorMessage
        ));
    }
};
