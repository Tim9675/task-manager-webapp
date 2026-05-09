import Event from "../models/Event.js";
import { getUserId } from "../helpers/getUserId.js";

export async function getEvents(req, res) {
  try {
    const userId = getUserId(req);
    const events = await Event.find({ userId })
      .sort({ startAt: 1, createdAt: 1 })
      .lean();
  } catch (error) {}
}
