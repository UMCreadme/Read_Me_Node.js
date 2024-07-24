import express from 'express';
import asyncHandler from 'express-async-handler';
import { getShortsDetail } from './shorts.controller.js';

export const shortsRouter = express.Router();

shortsRouter.get('/detail', asyncHandler(getShortsDetail));