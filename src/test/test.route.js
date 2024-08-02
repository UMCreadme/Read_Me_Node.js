import express from 'express';
import asyncHandler from 'express-async-handler';
import { errorTest, getDataTest, getTest, imageTest, paginationTest } from './test.controllers.js';
import imgUploader from '../../config/s3.manager.js';
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';

export const testRouter = express.Router();

testRouter.get('/', asyncHandler(getTest));
testRouter.get('/data', asyncHandler(getDataTest));
testRouter.get('/pagination', asyncHandler(paginationTest));
testRouter.get('/error', asyncHandler(errorTest));

testRouter.post('/image', imgUploader.single('image'), (req, res, next) => {
    next(); // 다음 미들웨어로 넘어가기
}, asyncHandler(imageTest));