import express from 'express';
import asyncHandler from 'express-async-handler';
import { createCommunityController,joinCommunityController } from './communities.controllers.js';
import { authJWT } from '../jwt/authJWT.js';

export const communitiesRouter = express.Router();

communitiesRouter.post('/', asyncHandler(authJWT), asyncHandler(createCommunityController));

// 커뮤니티 가입 엔드포인트
communitiesRouter.post('/:communityId', asyncHandler(authJWT), asyncHandler(joinCommunityController));
