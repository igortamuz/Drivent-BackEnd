import { getActivitiesByTicketController, getActivitiesController, getSeatsAvailableController, postSubscriptionController } from '@/controllers/activities.controller';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken)
  .get('/seats', getSeatsAvailableController)
  .get('/seats/user', getActivitiesByTicketController)
  .get('/day/:dayId', getActivitiesController)
  .post('/subscription', postSubscriptionController);

export { activitiesRouter };
