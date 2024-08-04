import express from 'express';
import asyncHandler from 'express-async-handler';
import { getCommunitiesController } from './communities.controllers.js';
import { getMessagesController, postMessageController, markMessageReadController } from '../chat/chat.controller.js';

// 기존 라우터 객체 사용
export const communitiesRouter = express.Router();

// 기존의 커뮤니티 관련 라우트
communitiesRouter.get('/', asyncHandler(getCommunitiesController));

// 채팅 메시지 목록 조회
communitiesRouter.get('/:communityId/messages', asyncHandler(getMessagesController));

// 채팅 메시지 저장
communitiesRouter.post('/:communityId/messages', asyncHandler(postMessageController));

// 메시지 읽기 상태 저장
communitiesRouter.post('/:communityId/messages/read', asyncHandler(markMessageReadController));
