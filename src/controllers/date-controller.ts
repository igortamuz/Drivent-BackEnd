import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import dateService from "@/services/date-service";

export async function getDate(req: AuthenticatedRequest, res: Response) {
  try {
    const dates = await dateService.getDates();
    return res.status(httpStatus.OK).send(dates);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

