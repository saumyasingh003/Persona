import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DSAQuestion from "@/lib/models/DSAQuestion";

// GET - Fetch all DSA questions
export async function GET() {
  try {
    await connectDB();

    const questions = await DSAQuestion.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: questions },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch questions",
      },
      { status: 500 }
    );
  }
}

// POST - Create a new DSA question
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { questionNumber, topic, problemStatement, difficulty } = body;

    // Validation
    if (!questionNumber || !topic || !problemStatement || !difficulty) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: questionNumber, topic, problemStatement, difficulty",
        },
        { status: 400 }
      );
    }

    const question = await DSAQuestion.create(body);

    return NextResponse.json(
      { success: true, data: question },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create question",
      },
      { status: 500 }
    );
  }
}
