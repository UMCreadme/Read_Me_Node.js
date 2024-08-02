import express from 'express';
import asyncHandler from 'express-async-handler';
import { getCategoryShorts, getHomeInfo } from './home.controller.js';

export const homeRouter = express.Router();

homeRouter.get('/categories', asyncHandler(getCategoryShorts));

// 메인 화면 정보 조회 (맞춤 탭)
homeRouter.get('/', asyncHandler(getHomeInfo));
