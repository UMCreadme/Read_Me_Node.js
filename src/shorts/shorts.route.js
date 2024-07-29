import express from 'express';
import asyncHandler from 'express-async-handler';
import { createShorts, getShortsDetail, searchShorts } from './shorts.controller.js';

export const shortsRouter = express.Router({mergeParams:true});

shortsRouter.get('/:shortsId', asyncHandler(getShortsDetail));
shortsRouter.get('', asyncHandler(searchShorts));

shortsRouter.post('', asyncHandler(createShorts));