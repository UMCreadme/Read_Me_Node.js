import express from 'express';
import asyncHandler from 'express-async-handler';
import { joinCommunityController } from './communityUsers.controllers.js';

// 테스트용 인증 미들웨어
const testAuthMiddleware = (req, res, next) => {
    // 요청에 대해 테스트용 사용자 ID를 설정
    req.user = { id: 6 }; // 테스트 사용자 ID:6으로 설정
    next();
};

const communityUsersRouter = express.Router();

// 테스트용 인증 미들웨어를 엔드포인트에 추가
communityUsersRouter.post('/join', testAuthMiddleware, asyncHandler(joinCommunityController));

export { communityUsersRouter };
