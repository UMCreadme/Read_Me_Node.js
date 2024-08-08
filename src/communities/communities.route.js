import express from 'express';
import asyncHandler from 'express-async-handler';
import { createCommunityController,joinCommunityController,getCommunitiesController } from './communities.controllers.js';
import { authJWT } from '../jwt/authJWT.js';

export const communitiesRouter = express.Router();

// 모임 조회
communitiesRouter.get('/', asyncHandler(getCommunitiesController));

// 나의 참여 모임 조회
communitiesRouter.get('/my', asyncHandler(authJWT), asyncHandler(getCommunitiesController));

// 모임 생성
communitiesRouter.post('/', asyncHandler(authJWT), asyncHandler(createCommunityController));

// 모임 참여
communitiesRouter.post('/:communityId', asyncHandler(authJWT), asyncHandler(joinCommunityController));

