import express from 'express';
import asyncHandler from 'express-async-handler';
import { getCategoryShorts } from './home.controller.js';

export const homeRouter = express.Router();

homeRouter.get('/home/categories', asyncHandler(getCategoryShorts));