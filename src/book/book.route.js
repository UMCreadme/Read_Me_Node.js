import express from 'express';
import asyncHandler from 'express-async-handler';
import { getBookDetail } from './book.controller.js';

export const bookRouter = express.Router({mergeParams:true});

bookRouter.get('/:ISBN', asyncHandler(getBookDetail));