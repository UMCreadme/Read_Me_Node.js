import express from 'express';
import { getDataTest, getTest, paginationTest } from './test.controllers.js';

export const testRouter = express.Router();

testRouter.get('/', getTest);
testRouter.get('/data', getDataTest);
testRouter.get('/pagination', paginationTest);