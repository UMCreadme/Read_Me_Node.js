import express from 'express';
import asyncHandler from 'express-async-handler';
import { createShorts, getShortsDetail, searchShorts, addComment, likeShorts, deleteShorts } from './shorts.controller.js';
import imgUploader from '../../config/s3.manager.js';
import { authJWT } from '../jwt/authJWT.js';


export const shortsRouter = express.Router({mergeParams:true});

shortsRouter.get('', asyncHandler(searchShorts));
shortsRouter.get('/:shortsId', asyncHandler(getShortsDetail));

shortsRouter.post('/:shortsId/comments', asyncHandler(addComment));
shortsRouter.post('/:shortsId/likes', asyncHandler(likeShorts));
shortsRouter.delete('/:shortsId', asyncHandler(authJWT), asyncHandler(deleteShorts));

// 쇼츠 생성 (로그인 필수)
shortsRouter.post('', asyncHandler(authJWT), imgUploader.single('image'), (req, res, next) => {
    next(); // 다음 미들웨어로 넘어가기
}, asyncHandler(createShorts));

