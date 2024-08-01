import express from 'express';
import asyncHandler from 'express-async-handler';
import { createShorts, getShortsDetail, searchShorts, addComment, likeShorts } from './shorts.controller.js';
import imgUploader from '../../config/s3.manager.js';


export const shortsRouter = express.Router({mergeParams:true});

shortsRouter.get('/:shortsId', asyncHandler(getShortsDetail));
shortsRouter.get('', asyncHandler(searchShorts));

shortsRouter.post('/:shortsId/comments', asyncHandler(addComment));
shortsRouter.post('/:shortsId/likes', asyncHandler(likeShorts));


shortsRouter.post('', imgUploader.single('image'), (req, res, next) => {
    next(); // 다음 미들웨어로 넘어가기
}, asyncHandler(createShorts));

