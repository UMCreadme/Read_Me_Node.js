import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { fetchMessagesService, saveMessageService, saveMessageReadStatusService } from './chat.service.js';

export const getMessagesController = async (req, res, next) => {
    const { communityId } = req.params; // URL 경로 매개변수에서 추출

    try {
        const messages = await fetchMessagesService(communityId);
        res.status(status.SUCCESS.status).send(response(
            status.SUCCESS,
            messages,
            {} // 빈 pageInfo 객체
        ));
    } catch (error) {
        next(error);
    }
};

export const postMessageController = async (req, res, next) => {
    const { communityId } = req.params; // URL 경로 매개변수에서 추출
    const { userId, content } = req.body;

    try {
        const message = await saveMessageService(communityId, userId, content);
        res.status(status.SUCCESS.status).send(response(
            status.SUCCESS,
            message,
            {} // 빈 pageInfo 객체
        ));
    } catch (error) {
        next(error);
    }
};

export const markMessageReadController = async (req, res, next) => {
    const { messageId, userId } = req.body;

    try {
        await saveMessageReadStatusService(messageId, userId);
        res.status(status.NO_CONTENT.status).send(response(
            status.NO_CONTENT,
            null,
            {} // 빈 pageInfo 객체
        ));
    } catch (error) {
        next(error);
    }
};
