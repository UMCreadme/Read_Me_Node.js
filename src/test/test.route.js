import express from 'express';
import asyncHandler from 'express-async-handler';
import { getDataTest, getTest, paginationTest } from './test.controllers.js';
import { getErrorTest } from './test.service.js';
import imgUploader from '../../config/s3.manager.js';
import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';

export const testRouter = express.Router();

testRouter.get('/', asyncHandler(getTest));
testRouter.get('/data', asyncHandler(getDataTest));
testRouter.get('/pagination', asyncHandler(paginationTest));
testRouter.get('/error', asyncHandler(getErrorTest));

testRouter.post('/image', imgUploader.single('image'), (req, res) => {
    res.send(response(status.CREATED, req.file.location));
});
