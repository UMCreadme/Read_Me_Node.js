import express from 'express';
import asyncHandler from 'express-async-handler';
import { createCommunityController, getCommunitiesController, searchCommunityController } from './communities.controllers.js';
import { communityUsersRouter } from '../communityUsers/communityUsers.route.js';

export const communitiesRouter = express.Router();
communitiesRouter.get('/', asyncHandler(getCommunitiesController));
communitiesRouter.post('/', asyncHandler(createCommunityController));
communitiesRouter.post('/join', communityUsersRouter); // 커뮤니티 사용자 관련 라우터 추가
communitiesRouter.get('/search', asyncHandler(searchCommunityController));
