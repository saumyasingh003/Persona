import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import CalendarEvent from "@/lib/models/CalendarEvent";

export async function GET() {
  await connectToDatabase();
  try {
    const events = await CalendarEvent.find({});
    // Transform to map { "YYYY-M-D": "Title" }
    const eventMap = {};
    events.forEach((event) => {
      eventMap[event.dateKey] = event.title;
    });
    return NextResponse.json({ success: true, data: eventMap });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectToDatabase();
  try {
    const { dateKey, title } = await req.json();

    // Upsert: Update if exists, Create if not
    const event = await CalendarEvent.findOneAndUpdate(
      { dateKey },
      { title },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  // To handle delete by body or query if needed, but standard usually uses ID in URL.
  // I'll make a specialized DELETE here that takes dateKey from body or query param?
  // Standard REST uses /api/calendar/[id], but my IDs are dateKeys effectively.
  // I'll adhere to standard and create [id] route if I used Mongo ID, but here `dateKey` is the unique identifier for the frontend.
  // I'll use a query param `?dateKey=...` on this route for deletion simplicity or create a slug route.
  // Let's use searchParams.

  const { searchParams } = new URL(req.url);
  const dateKey = searchParams.get("dateKey");

  if (!dateKey) {
    return NextResponse.json(
      { success: false, error: "dateKey required" },
      { status: 400 }
    );
  }

  await connectToDatabase();
  try {
    await CalendarEvent.findOneAndDelete({ dateKey });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
