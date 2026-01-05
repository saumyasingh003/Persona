import mongoose from "mongoose";

const calendarEventSchema = new mongoose.Schema(
  {
    dateKey: {
      type: String,
      required: true,
      unique: true, // Assuming one event per day for now based on current UI
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CalendarEvent =
  mongoose.models.CalendarEvent ||
  mongoose.model("CalendarEvent", calendarEventSchema);

export default CalendarEvent;
