import express from 'express';
import asyncHandler from 'express-async-handler';
import { createCommunityController } from './communities.controllers.js';

export const communitiesRouter = express.Router();

communitiesRouter.post('/', asyncHandler(createCommunityController));

