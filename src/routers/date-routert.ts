import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getDate } from "@/controllers";

const dateRouter = Router();

dateRouter
  .all("/*", authenticateToken)
  .get("", getDate);

export { dateRouter };

