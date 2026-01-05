"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const QUOTES = [
  "Success usually comes to those who are too busy to be looking for it.",
  "The secret of getting ahead is getting started.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Discipline is choosing between what you want now and what you want most.",
  "Dream big. Start small. Act now.",
  "Hard work beats talent when talent doesn’t work hard.",
  "Consistency is the foundation of excellence.",
  "Success is built daily, not in a day.",
  "Focus on progress, not perfection.",
  "Your future is created by what you do today.",
  "Small steps every day lead to big results.",
  "Action is the real measure of intelligence.",
  "The pain you feel today becomes strength tomorrow.",
  "Stay patient and trust your journey.",
  "You don’t need motivation—you need discipline."
];

const MotivationCard = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[randomIndex]);
  }, []);

  return (
    <div className="relative rounded-xl border border-gray-400 bg-white px-4 py-3">
      
      {/* TOP-RIGHT OUTSIDE shadow */}
      <div className="pointer-events-none absolute -top-2 right-2 h-3 w-24 rounded-full shadow-[0_-8px_16px_-6px_rgba(0,0,0,0.25)]" />

      {/* Image + Quote in one line */}
      <div className="flex items-start gap-3">
        <Image
          src="/quote.png"
          alt="Motivation"
          width={32}
          height={32}
          className="shrink-0"
        />

        <p className="text-md  font-bold italic  text-gray-800 leading-relaxed">
          {quote}”
        </p>
      </div>
    </div>
  );
};

export default MotivationCard;
