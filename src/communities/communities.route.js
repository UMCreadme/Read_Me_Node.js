import express from 'express';
import asyncHandler from 'express-async-handler';
import { createCommunityController } from './communities.controllers.js';
import { getCommunitiesController } from './communities.controllers.js';

export const communitiesRouter = express.Router();

communitiesRouter.get('/', asyncHandler(getCommunitiesController));
communitiesRouter.post('/create', asyncHandler(createCommunityController));

