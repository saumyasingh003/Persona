import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Todo from "@/lib/models/Todo";

export async function PATCH(req, props) {
  const params = await props.params;
  await connectToDatabase();
  try {
    const { id } = params;
    const { completed } = await req.json();

    const updateData = { completed };
    if (completed) {
      updateData.completedAt = new Date();
    } else {
      updateData.completedAt = null;
    }

    const todo = await Todo.findByIdAndUpdate(id, updateData, { new: true });

    if (!todo) {
      return NextResponse.json(
        { success: false, error: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: todo });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, props) {
  const params = await props.params;
  await connectToDatabase();
  try {
    const { id } = params;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return NextResponse.json(
        { success: false, error: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
