import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { BaseError } from '../../config/error.js';
import { fetchMessagesService, saveMessageService, saveMessageReadStatusService } from './chat.service.js';

// 채팅 메시지 조회
export const getMessagesController = async (req, res, next) => {
    const { communityId } = req.params;
    const userId = req.user_id;
    const page = parseInt(req.query.page, 10) || 1;
    const size = parseInt(req.query.size, 10) || 10;

    if (!userId || !communityId) {
        return next(new BaseError(status.PARAMETER_IS_WRONG));
    }

    const { result, pageInfo } = await fetchMessagesService(communityId, userId, page, size);
    res.send(response(status.SUCCESS, result, pageInfo));
};

// 채팅 메시지 전송
export const postMessageController = async (req, res, next) => {
    const { communityId } = req.params;
    const { content } = req.body;
    const userId = req.user_id;

    if (!userId || !communityId || !content || content.trim() === '') {
        return next(new BaseError(status.PARAMETER_IS_WRONG));
    }

    await saveMessageService(communityId, userId, content);
    res.send(response(status.SUCCESS));
};

// 메시지 읽음 처리
export const markMessageReadController = async (req, res, next) => {
    const { messageId } = req.body;
    const userId = req.user_id;

    if (!userId || !messageId) {
        return next(new BaseError(status.PARAMETER_IS_WRONG));
    }

    await saveMessageReadStatusService(messageId, userId);
    res.send(response(status.NO_CONTENT));
};
