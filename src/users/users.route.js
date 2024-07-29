import express from "express";
import asyncHandler from "express-async-handler"

import {
    getUserInfo,
    getUserShorts,
    getUserLikeShorts,
    getUserBooks,
    followUser,
    searchUser,
    kakaoSignUp
} from "./users.controller.js"
import {authJWT} from "../jwt/authJWT.js";
import {refresh} from "../jwt/refresh.js";

export const userRouter = express.Router({mergeParams:true});

// 나의 정보 조회
userRouter.get('/my', asyncHandler(authJWT), asyncHandler(getUserInfo));

// 내가 만든 쇼츠 리스트 조회
userRouter.get("/my/shorts", asyncHandler(getUserShorts));

// 내가 찜한 쇼츠 리스트 조회
userRouter.get("/my/likes", asyncHandler(getUserLikeShorts));

//내가 읽은 책 리스트 조회
userRouter.get("/my/books", asyncHandler(getUserBooks));

// 다른 유저 팔로잉
userRouter.post("/:userId/follow", asyncHandler(followUser));

// 유저 검색 기능
userRouter.get("", asyncHandler(searchUser));

// 카카오 회원가입
userRouter.post("", asyncHandler(kakaoSignUp));

//액세스 토큰 만료, 리프레시 토큰을 이용해 엑세스토큰 재발급
userRouter.get("/refresh", asyncHandler(refresh))
