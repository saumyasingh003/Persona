"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Loader2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventInput, setEventInput] = useState("");

  const today = new Date();

  // Load events from API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/calendar");
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const getDateKey = (day) => {
    if (!day) return null;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return `${year}-${month}-${day}`;
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const handleDateClick = (day) => {
    if (!day) return;

    if (isEditing) {
      const dateKey = getDateKey(day);
      setSelectedDate(dateKey);
      setEventInput(events[dateKey] || "");
      setIsDialogOpen(true);
    }
  };

  const handleSaveEvent = async () => {
    if (!selectedDate) return;

    if (eventInput.trim() === "") {
      // Empty input treated as delete
      await handleDeleteEvent();
      return;
    }

    try {
      // Optimistic update
      setEvents((prev) => ({ ...prev, [selectedDate]: eventInput }));
      setIsDialogOpen(false);

      await axios.post("/api/calendar", {
        dateKey: selectedDate,
        title: eventInput,
      });
      toast.success("Event saved!");
    } catch (error) {
      console.error("Failed to save event", error);
      toast.error("Failed to save event");
      fetchEvents(); // Revert
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedDate) return;

    try {
      // Optimistic update
      const newEvents = { ...events };
      delete newEvents[selectedDate];
      setEvents(newEvents);
      setIsDialogOpen(false);

      await axios.delete(`/api/calendar?dateKey=${selectedDate}`);
      toast.success("Event removed");
    } catch (error) {
      console.error("Failed to delete event", error);
      toast.error("Failed to delete event");
      fetchEvents();
    }
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="relative rounded-xl border border-black bg-white p-4 h-[320px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft className="w-5 h-5 text-black" />
        </button>
        <h3 className="text-sm font-semibold text-black">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-xs font-medium text-black text-center py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {days.map((day, index) => {
          const dateKey = getDateKey(day);
          const hasEvent = day && events[dateKey];
          const eventName = hasEvent ? events[dateKey] : "";
          const isCurrentDay = day && isToday(day);

          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              title={eventName} // Shows event name on hover
              className={`
                text-center py-2 text-sm rounded-lg relative
                ${day === null ? "" : "cursor-pointer transition-colors"}
                ${
                  !day
                    ? ""
                    : isEditing
                    ? "hover:ring-1 hover:ring-black"
                    : "hover:bg-gray-100"
                }
                ${
                  hasEvent
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : isCurrentDay
                    ? "bg-black text-white font-bold"
                    : "text-black"
                }
              `}
            >
              {day}
              {/* Optional: Small dot indicator if space permits, but background color is requested */}
            </div>
          );
        })}
      </div>

      {/* Edit Toggle Button */}
      <div className="absolute bottom-3 right-3">
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            if (!isEditing) toast.info("Tap a date to add/edit events");
          }}
          className={`p-2 rounded-full shadow-lg transition-colors ${
            isEditing
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="Toggle Edit Mode"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      {/* Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              {events[selectedDate] ? "Edit Event" : "Add Event"}
            </DialogTitle>
            <DialogDescription>
              {selectedDate &&
                new Date(selectedDate).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="event"
                className="text-sm font-medium text-gray-700"
              >
                Event Name
              </label>
              <Input
                id="event"
                placeholder="e.g. Project Deadline, Birthday"
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveEvent()}
                autoFocus
                className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <p className="text-xs text-gray-500">
              Tip: Clear the text and save to delete an event.
            </p>
          </div>

          <DialogFooter className="sm:justify-between sm:items-center">
            {events[selectedDate] ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteEvent}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            ) : (
              <div></div> // Spacer
            )}

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveEvent}
                className="bg-black hover:bg-gray-800 text-white"
              >
                Save Event
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
