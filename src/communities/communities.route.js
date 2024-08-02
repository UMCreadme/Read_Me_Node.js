import express from 'express';
import asyncHandler from 'express-async-handler';
import { joinCommunityController } from './communities.controllers.js';

// 라우터 인스턴스 생성
export const communitiesRouter = express.Router();

// 사용자 ID를 직접 설정하는 미들웨어 (이렇게 설정하면 모든 요청에 동일한 사용자 ID가 적용됩니다)
const setUserMiddleware = (req, res, next) => {
    req.user = { id: 5 }; // 임시 사용자 ID: 6으로 설정
    next();
};

// 커뮤니티 가입 엔드포인트
communitiesRouter.post('/join', setUserMiddleware, asyncHandler(joinCommunityController));

