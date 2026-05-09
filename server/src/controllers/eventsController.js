import Event from "../models/Event.js";

export async function getEvents(req, res) {
  try {
    const userId = req.user.userId;
    const events = await Event.find({ userId })
      .sort({ startAt: 1, createdAt: 1 })
      .lean();
  } catch (error) {}
}
