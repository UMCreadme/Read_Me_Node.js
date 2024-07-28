import express from "express";
import asyncHandler from "express-async-handler"
import {getUserInfo, getOtherUserInfo, getUserShorts, getUserLikeShorts, getUserBooks, followUser } from "./users.controller.js"

export const userRouter = express.Router({mergeParams:true});

// 나의 정보 조회
userRouter.get('/my', asyncHandler(getUserInfo));

// 내가 만든 쇼츠 리스트 조회
userRouter.get("/my/shorts", asyncHandler(getUserShorts));

// 내가 찜한 쇼츠 리스트 조회
userRouter.get("/my/likes", asyncHandler(getUserLikeShorts));

//내가 읽은 책 리스트 조회
userRouter.get("/my/books", asyncHandler(getUserBooks));

// 다른 유저 팔로잉
userRouter.post("/:userId/follow", asyncHandler(followUser));


// 다른 유저 정보 조회 (로그인 필요 X)
userRouter.get('/:userId', asyncHandler(getOtherUserInfo));

// 다른 유저의 피드 조회 (로그인 필요 X)
userRouter.get('/:userId/shorts', asyncHandler(getUserShorts));
userRouter.get('/:userId/likes', asyncHandler(getUserLikeShorts));
userRouter.get('/:userId/books', asyncHandler(getUserBooks));