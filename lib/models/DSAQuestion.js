import mongoose from "mongoose";

const DSAQuestionSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: [true, "Question number is required"],
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
    },
    problemStatement: {
      type: String,
      required: [true, "Problem statement is required"],
      trim: true,
    },
    practiceLink: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: [true, "Difficulty is required"],
    },
    notes: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Prevent model recompilation in development
const DSAQuestion =
  mongoose.models.DSAQuestion ||
  mongoose.model("DSAQuestion", DSAQuestionSchema);

export default DSAQuestion;
