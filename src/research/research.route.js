import express from "express";
import asyncHandler from "express-async-handler"
import { deleteRecentSearchController, getRecentSearches } from "./research.controller.js";
import { authJWT } from "../jwt/authJWT.js";

export const researchRouter = express.Router({mergeParams:true});

// 최근 검색어 삭제
researchRouter.delete('/:recent_research_id', asyncHandler(authJWT), asyncHandler(deleteRecentSearchController));

// 최근 검색어 조회
researchRouter.get('/', asyncHandler(authJWT), asyncHandler(getRecentSearches));
