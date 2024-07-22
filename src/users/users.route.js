import express from "express";
import asyncHandler from "express-async-handler"

import {getUserInfo, getUserShorts, getUserLikeShorts, getUserBooks } from "./users.controller.js"

export const userRouter = express.Router({mergeParams:true});

// 나의 정보 조회
userRouter.get('/my', asyncHandler(getUserInfo));

// 내가 만든 쇼츠 리스트 조회
userRouter.get("/my/shorts", asyncHandler(getUserShorts));

// 내가 찜한 쇼츠 리스트 조회
userRouter.get("/my/likes", asyncHandler(getUserLikeShorts));

//내가 읽은 책 리스트 조회
userRouter.get("/my/books", asyncHandler(getUserBooks));