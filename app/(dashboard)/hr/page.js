"use client";

import NotionCard from "@/components/NotionCard";
import NotionContent from "@/components/NotionContent";
import React, { useState } from "react";

// Map each topic to its Notion page ID
// Replace these with your actual Notion page IDs
const notionPages = {
  hrQuestions: "1712b965e9e98002b083f10cd962896b",
  projects: "2df2b965e9e980419acac4ebbb199d9c",
};

const Hr = () => {
  const [active, setActive] = useState(null);

  // Get the current page title
  const getTitleForActive = () => {
    const titles = {
      hrQuestions: "HR Questions — Interview Prep",
      projects: "Project Questions — Interview Prep",
    };
    return titles[active] || "";
  };

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        <NotionCard
          title="HR Questions"
          subtitle="Behavioral, strengths, weaknesses"
          onClick={() => setActive("hrQuestions")}
          selected={active === "hrQuestions"}
        />

        <NotionCard
          title="Project Questions"
          subtitle="Explain projects & challenges"
          onClick={() => setActive("projects")}
          selected={active === "projects"}
        />
      </div>

      {/* Notion Content Viewer */}
      {active && (
        <NotionContent
          pageId={notionPages[active]}
          title={getTitleForActive()}
        />
      )}
    </div>
  );
};

export default Hr;
