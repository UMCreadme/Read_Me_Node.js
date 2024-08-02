import express from "express";
import asyncHandler from "express-async-handler"
import { deleteRecentSearchController } from "./research.controller.js";

export const researchRouter = express.Router({mergeParams:true});


// 최근 검색어 삭제
researchRouter.delete('/:recent_research_id', asyncHandler(deleteRecentSearchController));