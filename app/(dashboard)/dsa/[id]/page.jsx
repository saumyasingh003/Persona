"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { ArrowLeft, Loader2, Star, Copy, Check, Pencil } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Button } from "@/components/ui/button";

const QuestionDetail = () => {
  const router = useRouter();
  const params = useParams();
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);
  const [notesCopied, setNotesCopied] = useState(false);

  const toTitleCase = (text = "") =>
    text.replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`/api/dsa/${params.id}`);
        if (response.data.success) {
          setQuestion(response.data.data);
        } else {
          toast.error("Question not found");
          router.push("/dsa");
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to fetch question");
        router.push("/dsa");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchQuestion();
    }
  }, [params.id, router]);

  // Toggle completed status
  const toggleStatus = async () => {
    if (!question) return;

    try {
      const response = await axios.patch(`/api/dsa/${question._id}`, {
        completed: !question.completed,
      });

      if (response.data.success) {
        setQuestion((prev) => ({ ...prev, completed: !prev.completed }));
        toast.success(
          !question.completed ? "Marked as completed!" : "Marked as pending"
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update status");
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "code") {
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
      } else {
        setNotesCopied(true);
        setTimeout(() => setNotesCopied(false), 2000);
      }
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      {/* Header Row: Arrow (left) | Question (center) | Icons (right) */}
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {/* Back Button - Left */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dsa")}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {/* Question Title - Center */}
        <h1 className="text-xs sm:text-sm md:text-lg font-semibold text-gray-900 flex-1 text-center line-clamp-2 px-1">
          {toTitleCase(question.problemStatement)}
        </h1>

        {/* Icons Row - Edit, Star, Difficulty & LeetCode */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Edit */}
          <button
            onClick={() => router.push(`/dsa/${question._id}/edit`)}
            className="focus:outline-none transition-transform hover:scale-110"
            title="Edit Question"
          >
            <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </button>

          {/* Star */}
          <button
            onClick={toggleStatus}
            className="focus:outline-none transition-transform hover:scale-110"
            title={question.completed ? "Mark as pending" : "Mark as completed"}
          >
            <Star
              className={`h-4 w-4 sm:h-5 sm:w-5 cursor-pointer transition-colors ${
                question.completed
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
            />
          </button>

          {/* Difficulty */}
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium capitalize ${
              question.difficulty === "easy"
                ? "bg-green-100 text-green-700"
                : question.difficulty === "medium"
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {question.difficulty}
          </span>

          {/* LeetCode Link */}
          {question.practiceLink && (
            <a
              href={question.practiceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition"
            >
              <Image
                src="/leetcode.png"
                alt="LeetCode"
                width={16}
                height={16}
                className="sm:w-5 sm:h-5"
              />
            </a>
          )}
        </div>
      </div>

      {/* Two Column Layout: Code (left) | Notes (right) */}
      {/* Stacks vertically on mobile, side by side on tablet+ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        {/* Code Section */}
        <div className="flex flex-col min-h-[300px] sm:min-h-[400px]">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-sm sm:text-base font-semibold text-gray-700">
              Code
            </h2>
            {question.code && (
              <button
                onClick={() => copyToClipboard(question.code, "code")}
                className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition"
                title="Copy code"
              >
                {codeCopied ? (
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span className="hidden sm:inline">
                  {codeCopied ? "Copied!" : "Copy"}
                </span>
              </button>
            )}
          </div>
          <div className="flex-1 rounded-lg overflow-auto max-h-[50vh] sm:max-h-[500px]">
            {question.code ? (
              <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  fontSize: "0.75rem",
                }}
                className="sm:text-sm! sm:p-4!"
                showLineNumbers
                wrapLines
                wrapLongLines
              >
                {question.code}
              </SyntaxHighlighter>
            ) : (
              <div className="bg-gray-900 rounded-lg p-4 h-full flex items-center justify-center">
                <p className="text-gray-500 italic text-sm">
                  No code added yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="flex flex-col min-h-[300px] sm:min-h-[400px]">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-sm sm:text-base font-semibold text-gray-700">
              Notes
            </h2>
            {question.notes && (
              <button
                onClick={() => copyToClipboard(question.notes, "notes")}
                className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition"
                title="Copy notes"
              >
                {notesCopied ? (
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span className="hidden sm:inline">
                  {notesCopied ? "Copied!" : "Copy"}
                </span>
              </button>
            )}
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-3 sm:p-4 overflow-auto max-h-[50vh] sm:max-h-[500px]">
            {question.notes ? (
              <ReactMarkdown
                components={{
                  ul({ children }) {
                    return (
                      <ul className="list-disc list-outside space-y-1 ml-5 text-sm sm:text-base">
                        {children}
                      </ul>
                    );
                  },
                  ol({ children }) {
                    return (
                      <ol className="list-decimal list-outside space-y-1 ml-5 text-sm sm:text-base">
                        {children}
                      </ol>
                    );
                  },
                  li({ children }) {
                    return (
                      <li className="text-gray-700 text-sm sm:text-base pl-1">
                        {children}
                      </li>
                    );
                  },
                  h1({ children }) {
                    return (
                      <h1 className="text-lg sm:text-xl font-bold mb-2">
                        {children}
                      </h1>
                    );
                  },
                  h2({ children }) {
                    return (
                      <h2 className="text-base sm:text-lg font-bold mb-2">
                        {children}
                      </h2>
                    );
                  },
                  h3({ children }) {
                    return (
                      <h3 className="text-sm sm:text-md font-semibold mb-1">
                        {children}
                      </h3>
                    );
                  },
                  strong({ children }) {
                    return <strong className="font-bold">{children}</strong>;
                  },
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ fontSize: "0.75rem" }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-gray-200 px-1 py-0.5 rounded text-xs sm:text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {question.notes}
              </ReactMarkdown>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 italic text-sm">
                  No notes added yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
