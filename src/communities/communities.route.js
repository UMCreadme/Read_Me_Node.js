import express from 'express';
import asyncHandler from 'express-async-handler';
import { searchCommunityController } from './communities.controllers.js';

export const communitiesRouter = express.Router();

// 검색 엔드포인트
communitiesRouter.get('/search', asyncHandler(searchCommunityController));
