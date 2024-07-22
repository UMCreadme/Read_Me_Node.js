import express from 'express';
import asyncHandler from 'express-async-handler';
import { getDataTest, getTest, paginationTest } from './test.controllers.js';
import { getErrorTest } from './test.service.js';

export const testRouter = express.Router();

testRouter.get('/', asyncHandler(getTest));
testRouter.get('/data', asyncHandler(getDataTest));
testRouter.get('/pagination', asyncHandler(paginationTest));
testRouter.get('/error', asyncHandler(getErrorTest));