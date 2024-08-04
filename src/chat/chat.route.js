import express from 'express';
import asyncHandler from 'express-async-handler';
import { getMessagesController, postMessageController, markMessageReadController } from './chat.controller.js';

// 새로운 라우터 객체 생성
export const chatRouter = express.Router();

// 채팅 메시지 목록 조회
chatRouter.get('/communities/:communityId/messages', asyncHandler(getMessagesController));

// 채팅 메시지 저장
chatRouter.post('/communities/:communityId/messages', asyncHandler(postMessageController));

// 메시지 읽기 상태 저장
chatRouter.post('/communities/:communityId/messages/read', asyncHandler(markMessageReadController));
