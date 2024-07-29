import express from 'express';
import asyncHandler from 'express-async-handler';
import { searchCommunityController } from './communities.controllers.js';

export const communitiesRouter = express.Router();

communitiesRouter.get('/search', asyncHandler(searchCommunityController));
