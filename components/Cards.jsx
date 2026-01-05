"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const Cards = ({ title, subtitle, path }) => {
  const [selected, setSelected] = useState(false);
  const router = useRouter();

  const handleDoubleClick = () => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <button
      onClick={() => setSelected(!selected)}
      onDoubleClick={handleDoubleClick}
      className={cn(
        "w-full cursor-pointer rounded-xl bg-white p-4 transition-all text-left",
        selected
          ? "border-2 border-black"
          : "border-2 border-gray-200 hover:border-black"
      )}
      type="button"
    >
      {/* Heading */}
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>

      {/* Subheading */}
      <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
    </button>
  );
};

export default Cards;
