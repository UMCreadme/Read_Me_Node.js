import express from 'express';
import asyncHandler from 'express-async-handler';
import {
    deleteCommunityController,
    createCommunityController,
    joinCommunityController,
    getCommunitiesController,
    leaveCommunityController,
    getCommunityDetailsController,
    getChatroomDetailsController,
    updateMeetingDetailsController
} from './communities.controllers.js';
import { authJWT, authJWTNoUserRequired } from '../jwt/authJWT.js';

export const communitiesRouter = express.Router();

communitiesRouter.get('/', asyncHandler(getCommunitiesController));
communitiesRouter.post('/', asyncHandler(authJWT), asyncHandler(createCommunityController));
communitiesRouter.post('/:communityId', asyncHandler(authJWT), asyncHandler(joinCommunityController));
communitiesRouter.delete('/:communityId', asyncHandler(authJWT), asyncHandler(deleteCommunityController));
communitiesRouter.delete('/:communityId/leave', asyncHandler(authJWT), asyncHandler(leaveCommunityController));
communitiesRouter.get('/:communityId', asyncHandler(authJWTNoUserRequired), asyncHandler(getCommunityDetailsController));
communitiesRouter.get('/:communityId/details', asyncHandler(authJWT), asyncHandler(getChatroomDetailsController));
communitiesRouter.patch('/:communityId/details', asyncHandler(authJWT), asyncHandler(updateMeetingDetailsController));

