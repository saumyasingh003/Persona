"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const NotionContent = ({ pageId, title }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pageId) {
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/notion?pageId=${pageId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch content");
        }

        setContent(data.content);
      } catch (err) {
        console.error("Error loading Notion content:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [pageId]);

  // Custom components for ReactMarkdown - Only black, white, red-600
  const customComponents = {
    // Smaller images with max-width
    img: ({ node, ...props }) => (
      <img
        {...props}
        className="max-w-xs md:max-w-sm rounded-lg border border-black my-4"
        style={{ maxHeight: "250px", objectFit: "contain" }}
        alt={props.alt || "Image"}
      />
    ),
    // Headings - black text
    h1: ({ node, ...props }) => (
      <h1 {...props} className="text-lg font-bold text-black mt-8 mb-4" />
    ),
    h2: ({ node, ...props }) => (
      <h2
        {...props}
        className="text-lg font-semibold text-black mt-8 mb-4 pb-2 border-b border-black"
      />
    ),
    h3: ({ node, ...props }) => (
      <h3 {...props} className="text-base font-semibold text-black mt-6 mb-3" />
    ),
    // Paragraphs - black text
    p: ({ node, ...props }) => (
      <p {...props} className="text-black mb-4 leading-relaxed" />
    ),
    // Lists - styled with proper bullets
    ul: ({ node, ...props }) => (
      <ul {...props} className="mb-6 space-y-3 text-black pl-4" />
    ),
    ol: ({ node, ...props }) => (
      <ol {...props} className="list-decimal mb-6 space-y-3 text-black pl-6" />
    ),
    // List items with dash prefix
    li: ({ node, ...props }) => (
      <li {...props} className="flex items-start gap-2">
        <span className="text-red-600 font-bold">—</span>
        <span>{props.children}</span>
      </li>
    ),
    // Horizontal rule - black border
    hr: ({ node, ...props }) => (
      <hr {...props} className="my-8 border-t-2 border-black" />
    ),
    // Code styling - red-600
    code: ({ node, inline, ...props }) =>
      inline ? (
        <code {...props} className="text-red-600 text-sm font-mono" />
      ) : (
        <code
          {...props}
          className="inline-block text-red-600 text-sm font-mono my-4"
        />
      ),
    // Blockquote - black border
    blockquote: ({ node, ...props }) => (
      <blockquote
        {...props}
        className="border-l-4 border-black pl-4 py-2 my-6 bg-white italic text-black"
      />
    ),
    // Links - red-600
    a: ({ node, ...props }) => (
      <a {...props} className="text-red-600 underline hover:text-black" />
    ),
    // Strong/bold - black
    strong: ({ node, ...props }) => (
      <strong {...props} className="font-bold text-black" />
    ),
  };

  if (!pageId) {
    return (
      <div className="flex items-center justify-center h-64 text-black">
        <p>Select a topic to view notes</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-white border-t-black rounded-full animate-spin" />
          <p className="text-sm text-black">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load content</p>
          <p className="text-sm text-black mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-black bg-white overflow-hidden">
      {/* Header */}
      {title && (
        <div className="border-b border-black px-6 py-4 bg-white">
          <h2 className="text-lg font-semibold text-black">{title}</h2>
          <p className="text-xs text-black mt-1">From Notion</p>
        </div>
      )}

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[70vh] bg-white">
        <article className="max-w-none">
          <ReactMarkdown components={customComponents}>{content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default NotionContent;
