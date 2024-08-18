import express from 'express';
import asyncHandler from 'express-async-handler';
import {
    deleteCommunityController,
    getMyCommunitiesController,
    createCommunityController,
    joinCommunityController,
    getCommunitiesController,
    leaveCommunityController,
    getCommunityDetailsController,
    getChatroomDetailsController,
    updateMeetingDetailsController,
    searchCommunityController
} from './communities.controllers.js';
import { authJWT, authJWTNoUserRequired } from '../jwt/authJWT.js';

export const communitiesRouter = express.Router();

// 모임 조회
communitiesRouter.get('/', asyncHandler(getCommunitiesController));

// 나의 참여 모임 조회
communitiesRouter.get('/my', asyncHandler(authJWT), asyncHandler(getMyCommunitiesController));

// 모임 생성
communitiesRouter.post('/', asyncHandler(authJWT), asyncHandler(createCommunityController));

// 모임 참여
communitiesRouter.post('/:communityId', asyncHandler(authJWT), asyncHandler(joinCommunityController));
communitiesRouter.get('/search', asyncHandler(searchCommunityController));
communitiesRouter.delete('/:communityId', asyncHandler(authJWT), asyncHandler(deleteCommunityController));
communitiesRouter.delete('/:communityId/leave', asyncHandler(authJWT), asyncHandler(leaveCommunityController));
communitiesRouter.get('/:communityId', asyncHandler(authJWTNoUserRequired), asyncHandler(getCommunityDetailsController));
communitiesRouter.get('/:communityId/details', asyncHandler(authJWT), asyncHandler(getChatroomDetailsController));
communitiesRouter.patch('/:communityId/details', asyncHandler(authJWT), asyncHandler(updateMeetingDetailsController));

