import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { fetchMessagesService, saveMessageService, saveMessageReadStatusService } from './chat.service.js';

// 채팅 조회
export const getMessagesController = async (req, res) => {
    const { communityId } = req.params;
    const userId = req.user_id;
    const page = parseInt(req.query.page, 10) || 1;  // 기본값 1
    const size = parseInt(req.query.size, 10) || 10;  // 기본값 10

    if (!userId) {
        return res.status(status.UNAUTHORIZED.status).json(response(status.UNAUTHORIZED));
    }

    const { result, pageInfo } = await fetchMessagesService(communityId, userId, page, size);
    res.status(status.SUCCESS.status).json(response(status.SUCCESS, result, pageInfo));
};

// 채팅전송
export const postMessageController = async (req, res, next) => {
    const { communityId } = req.params;
    const { content } = req.body;
    const userId = req.user_id;

    if (!userId) {
        return res.send(response(status.UNAUTHORIZED));
    }

    if (!content || content.trim() === '') {
        return res.send(response(status.NO_CONTENT));
    }

    const message = await saveMessageService(communityId, userId, content);
    res.send(response(status.SUCCESS));
};

// 메시지 읽음처리(일일이 하는 경우)
export const markMessageReadController = async (req, res, next) => {
    const { messageId } = req.body;
    const userId = req.user_id;

    if (!userId) {
        return res.status(status.UNAUTHORIZED.status).send(response(status.UNAUTHORIZED));
    }

    await saveMessageReadStatusService(messageId, userId);
    res.status(status.NO_CONTENT.status).json(response(status.NO_CONTENT, null));
};
