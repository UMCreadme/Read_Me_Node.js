import {
    isUserInCommunityDao,
    fetchMessagesDao,
    saveMessageDao,
    saveMessageReadStatusDao,
    fetchCommunityByIdDao,
    fetchMessageByIdDao,
    countMessagesDao
} from './chat.dao.js';

import {
    getMessagesDto,
    postMessageDto
} from './chat.dto.js';

import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import { pageInfo } from '../../config/pageInfo.js';

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

    // 다음 페이지가 있으면 마지막 요소 제거
    if (hasNext) {
        messages.pop();
    }

    // 전체 메시지 개수 가져오기
    const totalMessages = await countMessagesDao(communityId);

    // pageInfo 함수 사용
    const pageInfoData = pageInfo(page, messages.length, hasNext, totalMessages);

    // 최신 메시지 ID 가져오기 및 읽음 상태 업데이트
    if (messages.length > 0) {
        const latestMessageId = messages[0].message_id;
        await saveMessageReadStatusService(latestMessageId, userId);
    }

    return {
        result: getMessagesDto(messages, userId),
        pageInfo: pageInfoData
    };
};


// 메시지 읽음 상태 저장
export const saveMessageReadStatusService = async (messageId, userId) => {
    if (!messageId) {
        throw new BaseError(status.BAD_REQUEST);
    }

    const message = await fetchMessageByIdDao(messageId);

    // 사용자가 커뮤니티의 멤버인지 확인
    const isMember = await isUserInCommunityDao(message.community_id, userId);
    if (!isMember) {
        throw new BaseError(status.UNAUTHORIZED);
    }

    // 최신 메시지 조회 (현재 방에서)
    const [latestMessage] = await fetchMessagesDao(message.community_id, 1, 0);
    if (latestMessage?.message_id === messageId) {
        await saveMessageReadStatusDao(messageId, userId);
    }
};

// 메시지 저장
export const saveMessageService = async (communityId, userId, content) => {
    await fetchCommunityByIdDao(communityId);
    const isMember = await isUserInCommunityDao(communityId, userId);
    if (!isMember) {
        throw new BaseError(status.UNAUTHORIZED);
    }

    const newMessageId = await saveMessageDao(communityId, userId, content);
    const message = await postMessageDto({ message_id: newMessageId, user_id: userId, content });

    // 최신 메시지 조회 및 읽음 상태 업데이트
    const [latestMessage] = await fetchMessagesDao(message.community_id, 1, 0);
    if (latestMessage?.message_id === newMessageId) {
        await saveMessageReadStatusDao(newMessageId, userId);
    }

    return message;
};
