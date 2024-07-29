import express from 'express';
import asyncHandler from 'express-async-handler';
import { getCommunitiesController } from './communities.controllers.js';

export const communitiesRouter = express.Router();

communitiesRouter.get('/', asyncHandler(getCommunitiesController));
