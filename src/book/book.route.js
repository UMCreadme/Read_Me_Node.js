import express from 'express';
import asyncHandler from 'express-async-handler';
import {getBookDetail, getUserRecentBook} from "./book.controller.js";

export const bookRouter = express.Router({mergeParams:true});

bookRouter.get('/recent', asyncHandler(getUserRecentBook));

bookRouter.get('/:ISBN', asyncHandler(getBookDetail));