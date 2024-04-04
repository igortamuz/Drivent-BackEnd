import { prisma } from "@/config";

async function findDates() {
  return prisma.day.findMany();
}

const dateRepository = {
  findDates,
};

export default dateRepository;

