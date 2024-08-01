import express from 'express';
import asyncHandler from 'express-async-handler';
import {getUserRecentBook} from "./book.controller.js";

export const bookRouter = express.Router();

bookRouter.get('/recent', asyncHandler(getUserRecentBook))