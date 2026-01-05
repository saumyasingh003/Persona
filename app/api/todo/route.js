import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Todo from "@/lib/models/Todo";

export async function GET() {
  await connectToDatabase();
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: todos });
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
    const { text } = await req.json();

    // Check limit (optional, but good practice since frontend has it)
    const count = await Todo.countDocuments();
    if (count >= 5) {
      return NextResponse.json(
        { success: false, error: "Limit reached (5 tasks max)" },
        { status: 400 }
      );
    }

    const todo = await Todo.create({ text });
    return NextResponse.json({ success: true, data: todo });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
