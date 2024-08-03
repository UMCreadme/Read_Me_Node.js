import express from 'express';
import asyncHandler from 'express-async-handler';
import { getBookDetail, updateIsRead } from './book.controller.js';

export const bookRouter = express.Router({mergeParams:true});

bookRouter.get('/:ISBN', asyncHandler(getBookDetail));

bookRouter.post('/:ISBN', asyncHandler(updateIsRead));
