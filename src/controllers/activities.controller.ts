import { AuthenticatedRequest } from '@/middlewares';
import activitiesService from '@/services/activities-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function postSubscriptionController(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { activityId } = req.body;
  if (!activityId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
  try {
    const resultFromPost = await activitiesService.postSubscription(Number(userId), Number(activityId));

    return res.status(httpStatus.CREATED).send({
      resultFromPost,
    });
  } catch (error) {
    if (error.name ==='ConflictError') {
      return res.status(400).send(error.message);
    }
    if (error.name ==='NotFoundError') {
      return res.status(404).send('activity not found');
    }
    if (error.name ==='UnauthorizedError') {
      return res.status(403).send('No seats avalable for the activity');
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getActivitiesController(req: AuthenticatedRequest, res: Response) {
  const { dayId } = req.params;

  try {
    const result = await activitiesService.getActivities(Number(dayId));

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getSeatsAvailableController(req: AuthenticatedRequest, res: Response) {
  const { activityId, dayId } = req.body;

  if (!activityId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const availableSeats = await activitiesService.getCountOfSeats(Number(activityId ), Number(dayId));

    return res.status(httpStatus.OK).send({
      availableSeats,
    });
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getActivitiesByTicketController(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const seats = await activitiesService.getSeatsByTicket((Number(userId)));

    return res.status(httpStatus.OK).send({
      seats,
    });
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
