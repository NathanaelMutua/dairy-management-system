import { Router } from "express";
import { ussdImplementation } from "../controllers/ussdController";

export const ussdRouter = Router();

ussdRouter.post("/", ussdImplementation);
