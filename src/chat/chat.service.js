import { isUserInCommunityDao, fetchMessagesDao, saveMessageDao, saveMessageReadStatusDao, fetchCommunityByIdDao, fetchMessageByIdDao, countMessagesDao } from './chat.dao.js';
import { getMessagesDto, postMessageDto } from './chat.dto.js';
import { status } from '../../config/response.status.js';
import { BaseError } from '../../config/error.js';
import { pageInfo } from '../../config/pageInfo.js';

//메시지 조회
export const fetchMessagesService = async (communityId, userId, page = 1, size = 10) => {
    // 커뮤니티에 사용자가 속해 있는지 확인
    const isMember = await isUserInCommunityDao(communityId, userId);
    if (!isMember) {
        throw new BaseError(status.UNAUTHORIZED);
    }

    // 페이지네이션을 고려한 메시지 조회
    const offset = (page - 1) * size;
    const messages = await fetchMessagesDao(communityId, size + 1, offset); // size + 1로 더 많은 메시지 요청

    // 다음 페이지가 있는지 확인
    const hasNext = messages.length > size;
    const actualSize = hasNext ? size : messages.length;
    const messageList = messages.slice(0, actualSize);

    // pageInfo 함수 사용
    const pageInfoData = pageInfo(page, actualSize, hasNext);

    return {
        result: getMessagesDto(messageList, userId),
        pageInfo: pageInfoData
    };
};
// 메시지 전송
export const saveMessageService = async (communityId, userId, content) => {
    await fetchCommunityByIdDao(communityId);
    const isMember = await isUserInCommunityDao(communityId, userId);
    if (!isMember) {
        throw new BaseError(status.UNAUTHORIZED);
    }
    const messageId = await saveMessageDao(communityId, userId, content);
    return postMessageDto({ message_id: messageId, user_id: userId, content });
};

// 메시지 읽기
export const saveMessageReadStatusService = async (messageId, userId) => {
    const message = await fetchMessageByIdDao(messageId);
    const isMember = await isUserInCommunityDao(message.community_id, userId);
    if (!isMember) {
        throw new BaseError(status.UNAUTHORIZED);
    }
    await saveMessageReadStatusDao(messageId, userId);
};

