import { conflictError, notFoundError, requestError, unauthorizedError } from '@/errors';
import activitiesRepository from '@/repositories/activities-repository.ts';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function postSubscription(userId: number, activityId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote) {
    throw requestError(403, ' ticket with irregular status');
  }

  const activity = await activitiesRepository.findActivityById(activityId);

  if(!activity) {
    throw notFoundError();
  }

  const beginning = activity.startTime.getTime();
  const end = activity.endTime.getTime();

  const userActivitiesByDayiD = await activitiesRepository.findActivitiesForDay(ticket.id);
  userActivitiesByDayiD.forEach((seat) => {
    const startTime = seat.Activity.startTime.getTime();
    const endTime = seat.Activity.endTime.getTime();
    if (startTime >= beginning && startTime < end || endTime > beginning && endTime <=end || startTime ===beginning && endTime ===end) {
      throw conflictError('activity time conflict');
    }
  });
  const Seats = await activitiesRepository.countSeats(activity.id);
  const numberOfSeats = Seats.length;
  const availableSeats = activity.Venue.capacity - numberOfSeats;

  if (availableSeats <= 0) {
    throw unauthorizedError();
  }

  const post = await activitiesRepository.createSeat(ticket.id, activity.id);
  return post;
}

async function getActivities(dayId: number) {
  const activities = await activitiesRepository.findActivitiesByDayIdWithVenue(dayId);

  if (activities.length === 0) {
    throw notFoundError();
  }

  return activities;
}

async function getCountOfSeats(activityId: number, dayId: number) {
  const seats = await activitiesRepository.countSeats(activityId);
  
  const seatOfTheDay = seats.filter(seat => seat.Activity.dayId === dayId);

  const activity = await activitiesRepository.findActivityById(activityId);
  
  if(!activity) {
    throw notFoundError();
  }

  const seatsWithTicket =  seatOfTheDay.length;
  const availableSeats = activity.Venue.capacity - seatsWithTicket;

  return availableSeats;
}

async function getSeatsByTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote) {
    throw requestError(403, ' ticket with irregular status');
  }

  const activities = await activitiesRepository.findActivitiesByTicket(ticket.id);

  if(!activities) {
    throw notFoundError();
  }

  return activities;
}

const activitiesService = {
  postSubscription,
  getActivities,
  getCountOfSeats,
  getSeatsByTicket
};

export default activitiesService;
