import express from 'express';
import asyncHandler from 'express-async-handler';
import { createCommunityController } from './communities.controllers.js';

const communitiesRouter = express.Router();
communitiesRouter.post('/create', asyncHandler(createCommunityController));

export { communitiesRouter };
