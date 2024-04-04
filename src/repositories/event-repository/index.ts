import { prisma, redis } from "@/config";
import { Event } from "@prisma/client/index";

async function findFirst() {
  const cacheKey = "event";

  const event: Event = JSON.parse(await redis.get(cacheKey));

  if (event) return event;
  else {
    const data = await prisma.event.findFirst();
    redis.setEx(cacheKey, parseInt(process.env.EXPIRATION), JSON.stringify(data));
    return data;
  }
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
