import express from 'express';
import asyncHandler from 'express-async-handler';
import { createCommunityController } from './communities.controllers.js';
import { authJWT } from '../jwt/authJWT.js';

export const communitiesRouter = express.Router();

communitiesRouter.post('/', asyncHandler(authJWT), asyncHandler(createCommunityController));

