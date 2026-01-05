import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DSAQuestion from "@/lib/models/DSAQuestion";

// GET - Fetch a single DSA question
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const question = await DSAQuestion.findById(id);

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: question },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update a DSA question (e.g., toggle completed status)
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const question = await DSAQuestion.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: question },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a DSA question
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const question = await DSAQuestion.findByIdAndDelete(id);

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Question deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
