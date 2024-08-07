import express from 'express';
import asyncHandler from 'express-async-handler';
import { getBookDetail, getUserRecentBook,  searchBook,  updateIsRead} from './book.controller.js';
import { authJWT, authJWTNoUserRequired } from '../jwt/authJWT.js';

export const bookRouter = express.Router({mergeParams:true});

// 책 검색 (로그인 선택)
bookRouter.get('', asyncHandler(authJWTNoUserRequired), asyncHandler(searchBook));

// 최근 선택한 책 (로그인 필수)
bookRouter.get('/recent', asyncHandler(authJWT), asyncHandler(getUserRecentBook));

// 책 상세 정보 조회 (로그인 선택)
bookRouter.get('/:ISBN', asyncHandler(authJWTNoUserRequired), asyncHandler(getBookDetail));

// 책 읽음 여부 업데이트 (로그인 필수)
bookRouter.post('/:ISBN', asyncHandler(authJWT), asyncHandler(updateIsRead));
