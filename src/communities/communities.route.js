import express from 'express';
import asyncHandler from 'express-async-handler';
import { createCommunityController } from './communities.controllers.js';
import { authJWT } from '../jwt/authJWT.js';

export const communitiesRouter = express.Router();

communitiesRouter.post('/', asyncHandler(authJWT), asyncHandler(createCommunityController));

// communities.router.js
import express from 'express';
import asyncHandler from 'express-async-handler';
import { joinCommunityController } from './communities.controllers.js';
import { authJWT } from '../jwt/authJWT.js';

// 라우터 인스턴스 생성
export const communitiesRouter = express.Router({ mergeParams: true });

// 커뮤니티 가입 엔드포인트
communitiesRouter.post('/:communityId', asyncHandler(authJWT), asyncHandler(joinCommunityController));
