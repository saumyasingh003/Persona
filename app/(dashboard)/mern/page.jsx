"use client";

import NotionCard from "@/components/NotionCard";
import NotionContent from "@/components/NotionContent";
import React, { useState } from "react";

// Map each topic to its Notion page ID
// Replace these with your actual Notion page IDs
const notionPages = {
  react: "2d82b965e9e98098ba82c59947f2ce57",
  mongodb: "2d82b965e9e980508e18effd6c39735f",
  express: "2d82b965e9e980038ca4d6e9d773beec",
  node: "2d82b965-e9e9-80ef-b732-c3e123c597d9",
  next: "1762b965e9e9805a88dfd4a3b323f05d",
};

const Mern = () => {
  const [active, setActive] = useState(null);

  // Get the current page title
  const getTitleForActive = () => {
    const titles = {
      react: "React — Revision Notes",
      mongodb: "MongoDB — Revision Notes",
      express: "Express.js — Revision Notes",
      node: "Node.js — Revision Notes",
      next: "Next.js — Revision Notes",
    };
    return titles[active] || "";
  };

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <NotionCard
          title="React"
          subtitle="Hooks, State"
          onClick={() => setActive("react")}
          selected={active === "react"}
        />

        <NotionCard
          title="MongoDB"
          subtitle="Schema, Queries"
          onClick={() => setActive("mongodb")}
          selected={active === "mongodb"}
        />

        <NotionCard
          title="Express"
          subtitle="Routes, APIs"
          onClick={() => setActive("express")}
          selected={active === "express"}
        />

        <NotionCard
          title="Node.js"
          subtitle="Event Loop, FS, Backend"
          onClick={() => setActive("node")}
          selected={active === "node"}
        />

        <NotionCard
          title="Next.js"
          subtitle="App Router, SSR"
          onClick={() => setActive("next")}
          selected={active === "next"}
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

export default Mern;
