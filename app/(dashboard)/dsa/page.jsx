"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { Plus, FileText, Loader2, Star, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DSA = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("/api/dsa");
        if (response.data.success) {
          setQuestions(response.data.data);
        } else {
          toast.error("Failed to fetch questions");
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to fetch questions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Get unique topics from questions
  const topics = useMemo(() => {
    const uniqueTopics = [...new Set(questions.map((q) => q.topic))];
    return uniqueTopics.sort();
  }, [questions]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        q.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase());

      // Difficulty filter
      const matchesDifficulty =
        difficultyFilter === "all" || q.difficulty === difficultyFilter;

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && q.completed) ||
        (statusFilter === "pending" && !q.completed);

      // Topic filter
      const matchesTopic = topicFilter === "all" || q.topic === topicFilter;

      return (
        matchesSearch && matchesDifficulty && matchesStatus && matchesTopic
      );
    });
  }, [questions, searchQuery, difficultyFilter, statusFilter, topicFilter]);

  // Toggle completed status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await axios.patch(`/api/dsa/${id}`, {
        completed: !currentStatus,
      });

      if (response.data.success) {
        setQuestions((prev) =>
          prev.map((q) =>
            q._id === id ? { ...q, completed: !currentStatus } : q
          )
        );
        toast.success(
          !currentStatus ? "Marked as completed!" : "Marked as pending"
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update status");
    }
  };

  const toTitleCase = (text = "") =>
    text.replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setDifficultyFilter("all");
    setStatusFilter("all");
    setTopicFilter("all");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    difficultyFilter !== "all" ||
    statusFilter !== "all" ||
    topicFilter !== "all";

  return (
    <div className="w-full px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">DSA Questions</h1>

        <Button
          onClick={() => router.push("/dsa/addquestion")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {/* Filters Row */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Difficulty Filter */}
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulty</SelectItem>
            <SelectItem value="easy">
              <span className="text-green-600">Easy</span>
            </SelectItem>
            <SelectItem value="medium">
              <span className="text-blue-600">Medium</span>
            </SelectItem>
            <SelectItem value="hard">
              <span className="text-red-600">Hard</span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">
              <span className="text-yellow-600">⭐ Completed</span>
            </SelectItem>
            <SelectItem value="pending">
              <span className="text-gray-600">☆ Pending</span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Topic Filter */}
        <Select value={topicFilter} onValueChange={setTopicFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {topics.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-1 text-gray-500"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Results Count */}
      {!isLoading && (
        <div className="mt-3 text-sm text-gray-500">
          Showing {filteredQuestions.length} of {questions.length} questions
        </div>
      )}

      {/* Content */}
      <div className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {questions.length === 0
              ? 'No questions yet. Click "Add" to create your first question.'
              : "No questions match your filters."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Practice</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredQuestions.map((q) => (
                <TableRow key={q._id}>
                  {/* Problem Statement */}
                  <TableCell className="max-w-xs truncate">
                    {toTitleCase(q.problemStatement)}
                  </TableCell>

                  {/* Topic */}
                  <TableCell>
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {q.topic}
                    </span>
                  </TableCell>

                  {/* Practice Link (LeetCode Icon) */}
                  <TableCell>
                    {q.practiceLink ? (
                      <a
                        href={q.practiceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src="/leetcode.png"
                          alt="LeetCode"
                          width={24}
                          height={24}
                          className="hover:scale-110 transition"
                        />
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  {/* Difficulty */}
                  <TableCell>
                    <span
                      className={`font-medium capitalize ${
                        q.difficulty === "easy"
                          ? "text-green-600"
                          : q.difficulty === "medium"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </TableCell>

                  {/* Resource (FileText Icon) */}
                  <TableCell>
                    <button
                      onClick={() => router.push(`/dsa/${q._id}`)}
                      className="focus:outline-none transition-transform hover:scale-110"
                      title="View Details"
                    >
                      <FileText className="h-5 w-5 text-gray-600 cursor-pointer hover:text-black" />
                    </button>
                  </TableCell>

                  {/* Status - Star Icon */}
                  <TableCell>
                    <button
                      onClick={() => toggleStatus(q._id, q.completed)}
                      className="focus:outline-none transition-transform hover:scale-110"
                      title={
                        q.completed ? "Mark as pending" : "Mark as completed"
                      }
                    >
                      <Star
                        className={`h-6 w-6 cursor-pointer transition-colors ${
                          q.completed
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400 hover:text-yellow-400"
                        }`}
                      />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default DSA;
