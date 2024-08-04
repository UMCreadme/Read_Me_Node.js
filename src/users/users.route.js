import express from "express";
import asyncHandler from "express-async-handler"

import {
    getUserInfo,
    getUserShorts,
    getUserLikeShorts,
    getUserBooks,
    getOtherUserInfo,
    getUserShortsForGuest,
    getUserLikeShortsForGuest,
    getUserBooksForGuest,
    followUser,
    searchUser,
    kakaoSignUp, kakaoLogin
} from "./users.controller.js"
import {authJWT, authJWTNoUserRequired} from "../jwt/authJWT.js";
import {refresh} from "../jwt/refresh.js";

export const userRouter = express.Router({mergeParams:true});

// 나의 정보 조회
userRouter.get('/my', asyncHandler(authJWT), asyncHandler(getUserInfo));

// 내가 만든 쇼츠 리스트 조회
userRouter.get("/my/shorts", asyncHandler(authJWT), asyncHandler(getUserShorts));

// 내가 찜한 쇼츠 리스트 조회
userRouter.get("/my/likes", asyncHandler(authJWT), asyncHandler(getUserLikeShorts));

//내가 읽은 책 리스트 조회
userRouter.get("/my/books", asyncHandler(authJWT), asyncHandler(getUserBooks));

// 다른 유저 팔로잉
userRouter.post("/:userId/follow", asyncHandler(authJWT), asyncHandler(followUser));


// 다른 유저 정보 조회 (로그인 필요 X)
userRouter.get('/:userId', asyncHandler(authJWTNoUserRequired), asyncHandler(getOtherUserInfo));

// 로그인 후 유저 검색 기능
userRouter.get("/my/search", asyncHandler(authJWT), asyncHandler(searchUser));

// 로그인 안하고 유저 검색 기능
userRouter.get("/search", asyncHandler(searchUser))

// 카카오 회원가입
userRouter.post("/sign", asyncHandler(kakaoSignUp));

//카카오 로그인
userRouter.post("/login", asyncHandler(kakaoLogin));

//액세스 토큰 만료, 리프레시 토큰을 이용해 엑세스토큰 재발급
userRouter.get("/refresh", asyncHandler(refresh))

// 다른 유저의 피드 조회 (로그인 필요 X)
userRouter.get('/:userId/shorts', asyncHandler(getUserShortsForGuest));
userRouter.get('/:userId/likes', asyncHandler(getUserLikeShortsForGuest));
userRouter.get('/:userId/books', asyncHandler(getUserBooksForGuest));