import express from "express";
import asyncHandler from "express-async-handler"
import { addSearchController } from "./research.controller.js";


export const researchRouter = express.Router({mergeParams:true});

researchRouter.post('/add', addSearchController);