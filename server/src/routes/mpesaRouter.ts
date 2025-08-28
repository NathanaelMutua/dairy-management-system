import { Router } from "express";
import { mpesaImplementation } from "../controllers/mpesaController";

export const mpesaRouter = Router();

mpesaRouter.post("/callback", mpesaImplementation);
