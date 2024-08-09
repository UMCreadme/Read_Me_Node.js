// src/routes/chat.routes.js
import express from 'express';
import asyncHandler from 'express-async-handler';
import { getMessagesController, postMessageController, markMessageReadController } from './chat.controller.js';
import { authJWT } from '../jwt/authJWT.js';

export const chatRouter = express.Router();

// JWT 미들웨어 적용
chatRouter.use(authJWT);

// 채팅 메시지 목록 조회
chatRouter.get('/:communityId/messages', asyncHandler(getMessagesController));

// 채팅 메시지 저장
chatRouter.post('/:communityId/messages', asyncHandler(postMessageController));

// 메시지 읽기 상태 저장
chatRouter.post('/:communityId/messages/read', asyncHandler(markMessageReadController));
