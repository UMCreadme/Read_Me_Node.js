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

import { status } from '../../config/response.status.js';
import { BaseError } from '../../config/error.js';
import { pageInfo } from '../../config/pageInfo.js';

// 메시지 조회
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
    const messageList = messages.slice(0, size);

    // 전체 메시지 개수 가져오기
    const totalMessages = await countMessagesDao(communityId);

    // pageInfo 함수 사용
    const pageInfoData = pageInfo(page, messageList.length, hasNext, totalMessages);

    // 최신 메시지 ID 가져오기 및 읽음 상태 업데이트
    if (messageList.length > 0) {
        const latestMessageId = messageList[0].message_id; // 첫 번째 항목이 최신 메시지
        console.log(`최신 메시지 ID: ${latestMessageId}`); // 디버그용 로그 추가
        await saveMessageReadStatusService(latestMessageId, userId);
    }


    return {
        result: getMessagesDto(messageList, userId),
        pageInfo: pageInfoData
    };
};


// 메시지 읽음 상태 저장
export const saveMessageReadStatusService = async (messageId, userId) => {
    if (!messageId) {
        throw new BaseError(status.BAD_REQUEST, '메시지 ID가 제공되지 않았습니다.');
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
    } else {
        console.log(`메시지 ${messageId}는 최신 메시지가 아닙니다.`); // 디버그용 로그 추가
    }
};

// 메시지 저장
export const saveMessageService = async (communityId, userId, content, messageId = null) => {
    await fetchCommunityByIdDao(communityId);
    const isMember = await isUserInCommunityDao(communityId, userId);
    if (!isMember) {
        throw new BaseError(status.UNAUTHORIZED);
    }

    let message;
    if (messageId) {
        // 메시지 업데이트
        message = await updateMessageDao(communityId, userId, messageId, content);
    } else {
        // 새 메시지 저장
        const newMessageId = await saveMessageDao(communityId, userId, content);
        message = await postMessageDto({ message_id: newMessageId, user_id: userId, content });
    }

    // 최신 메시지 조회 및 읽음 상태 업데이트

    const [latestMessage] = await fetchMessagesDao(message.community_id, 1, 0);
    if (latestMessage?.message_id === messageId) {
        await saveMessageReadStatusDao(messageId, userId);
    } else {
        console.log(`메시지 ${messageId}는 최신 메시지가 아닙니다.`); 
    }

    return message;
};