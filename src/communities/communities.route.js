import express from 'express';
import asyncHandler from 'express-async-handler';
import { getCommunitiesController, deleteCommunityController } from './communities.controllers.js';
import { createCommunityController } from './communities.controllers.js';
import { authJWT } from '../jwt/authJWT.js';

export const communitiesRouter = express.Router();


communitiesRouter.get('/', asyncHandler(getCommunitiesController));

communitiesRouter.delete('/:communityId', asyncHandler(authJWT), asyncHandler(deleteCommunityController));

communitiesRouter.post('/', asyncHandler(authJWT), asyncHandler(createCommunityController));
