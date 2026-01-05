"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Loader2 } from "lucide-react";

const RandomQuestion = () => {
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toTitleCase = (text = "") =>
    text.replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

  useEffect(() => {
    const fetchAndSetQuestion = async () => {
      try {
        const response = await axios.get("/api/dsa");
        if (response.data.success && response.data.data.length > 0) {
          const questions = response.data.data;

          // Check localStorage for saved question and timestamp
          const saved = localStorage.getItem("randomDSAQuestion");
          const savedTimestamp = localStorage.getItem("randomDSAQuestionTime");
          const now = Date.now();
          const twentyFourHours = 24 * 60 * 60 * 1000;

          if (saved && savedTimestamp) {
            const timePassed = now - parseInt(savedTimestamp, 10);

            // If less than 24 hours, use saved question
            if (timePassed < twentyFourHours) {
              const savedQuestion = JSON.parse(saved);
              // Verify the saved question still exists in the list
              const exists = questions.find((q) => q._id === savedQuestion._id);
              if (exists) {
                setQuestion(savedQuestion);
                setIsLoading(false);
                return;
              }
            }
          }

          // Pick a new random question (24 hours passed or no saved question)
          const randomIndex = Math.floor(Math.random() * questions.length);
          const newQuestion = questions[randomIndex];

          // Save to localStorage
          localStorage.setItem(
            "randomDSAQuestion",
            JSON.stringify(newQuestion)
          );
          localStorage.setItem("randomDSAQuestionTime", now.toString());

          setQuestion(newQuestion);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetQuestion();
  }, []);

  if (isLoading) {
    return (
      <div className="relative rounded-xl border border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="relative rounded-xl border border-gray-200 bg-white px-4 py-3">
        <p className="text-sm text-gray-500 text-center">
          No DSA questions yet.
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-gray-400 bg-white px-4 py-3">
      {/* Header */}
      <h3 className="text-sm font-semibold text-gray-600 mb-2">
        Want to give the Random Question a try?
      </h3>

      {/* Question Row: Name (left) | LeetCode Icon (right) */}
      <div className="flex items-center justify-between gap-3">
        {/* Question Name */}
        <p className="text-base font-medium text-gray-900 line-clamp-1 flex-1">
          {toTitleCase(question.problemStatement)}
        </p>

        {/* LeetCode Icon */}
        {question.practiceLink ? (
          <a
            href={question.practiceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 hover:scale-110 transition"
          >
            <Image src="/leetcode.png" alt="LeetCode" width={24} height={24} />
          </a>
        ) : (
          <span className="text-xs text-gray-400">No link</span>
        )}
      </div>
    </div>
  );
};

export default RandomQuestion;
