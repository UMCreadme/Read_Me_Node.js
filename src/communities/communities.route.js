import express from 'express';
import asyncHandler from 'express-async-handler';
import { createCommunityController } from './communities.controllers.js';
import { communityUsersRouter } from '../communityUsers/communityUsers.route.js';
import { getCommunitiesController } from './communities.controllers.js';

export const communitiesRouter = express.Router();
communitiesRouter.get('/', asyncHandler(getCommunitiesController));
communitiesRouter.post('/create', asyncHandler(createCommunityController));
communitiesRouter.post('/join', communityUsersRouter); // 커뮤니티 사용자 관련 라우터 추가


