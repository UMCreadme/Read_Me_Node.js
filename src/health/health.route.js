import express from "express";
import { healthController } from "./health.controller.js";

export const healthRouter = express.Router();

healthRouter.get('', healthController);