import express from "express";
import asyncHandler from "express-async-handler"
import { getRecentSearches } from "./research.controller.js";

export const researchRouter = express.Router({mergeParams:true});

// 최근 검색어 조회
researchRouter.get('/', asyncHandler(getRecentSearches));