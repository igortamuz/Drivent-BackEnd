import dateRepository from "@/repositories/date-repository";

async function getDates() {
  const dates = await dateRepository.findDates();
  return dates;
}

const dateService = {
  getDates,
};

export default dateService;

