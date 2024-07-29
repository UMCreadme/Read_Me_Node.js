import express from 'express';
import asyncHandler from 'express-async-handler';
import { joinCommunityController } from './communityUsers.controllers.js';

const communityUsersRouter = express.Router();

// 커뮤니티 참여 엔드포인트
communityUsersRouter.post('/join', asyncHandler(joinCommunityController));

export { communityUsersRouter };
