import cors from 'cors';
import express, { Express } from 'express';
import 'express-async-errors';
import 'reflect-metadata';

import { connectDb, connectRedis, disconnectDB, disconnectRedis, loadEnv } from '@/config';

loadEnv();

import { handleApplicationErrors } from '@/middlewares';
import {
  activitiesRouter,
  authenticationRouter,
  bookingRouter,
  dateRouter,
  enrollmentsRouter,
  eventsRouter,
  hotelsRouter,
  paymentsRouter,
  ticketsRouter,
  usersRouter,
} from '@/routers';

const app = express();
app
  .use(cors())
  .use(express.json())
  .get('/health', (_req, res) => res.send('OK!'))
  .use('/users', usersRouter)
  .use('/auth', authenticationRouter)
  .use('/event', eventsRouter)
  .use('/enrollments', enrollmentsRouter)
  .use('/tickets', ticketsRouter)
  .use('/payments', paymentsRouter)
  .use('/hotels', hotelsRouter)
  .use('/booking', bookingRouter)
  .use('/activities', activitiesRouter)
  .use('/date', dateRouter)
  .use(handleApplicationErrors);

export async function init(): Promise<Express> {
  connectDb();
  await connectRedis();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
  await disconnectRedis();
}

export default app;
