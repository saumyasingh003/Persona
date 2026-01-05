"use client";

import { cn } from "@/lib/utils";

const NotionCard = ({ title, subtitle, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer rounded-lg px-4 py-3 transition-all",
        selected
          ? "border-2 border-black bg-gray-50"
          : "border border-gray-200 bg-white hover:bg-gray-50"
      )}
    >
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-600">{subtitle}</p>
    </div>
  );
};

export default NotionCard;
