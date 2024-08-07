import express from 'express';
import asyncHandler from 'express-async-handler';
import { createCommunityController,joinCommunityController,getCommunitiesController } from './communities.controllers.js';
import { authJWT } from '../jwt/authJWT.js';

export const communitiesRouter = express.Router();

communitiesRouter.get('/', asyncHandler(getCommunitiesController));
communitiesRouter.post('/', asyncHandler(authJWT), asyncHandler(createCommunityController));
communitiesRouter.post('/:communityId', asyncHandler(authJWT), asyncHandler(joinCommunityController));

