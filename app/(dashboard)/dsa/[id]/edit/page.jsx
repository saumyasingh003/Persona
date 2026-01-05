"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditQuestion = ({ params }) => {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    questionNumber: "",
    topic: "",
    problemStatement: "",
    practiceLink: "",
    difficulty: "",
    notes: "",
    code: "",
    completed: false,
  });

  // Fetch existing question data
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`/api/dsa/${id}`);
        if (response.data.success) {
          const q = response.data.data;
          setFormData({
            questionNumber: q.questionNumber.toString(),
            topic: q.topic,
            problemStatement: q.problemStatement,
            practiceLink: q.practiceLink || "",
            difficulty: q.difficulty,
            notes: q.notes || "",
            code: q.code || "",
            completed: q.completed,
          });
        } else {
          toast.error("Question not found");
          router.push("/dsa");
        }
      } catch (error) {
        toast.error("Failed to fetch question");
        router.push("/dsa");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDifficultyChange = (value) => {
    setFormData((prev) => ({ ...prev, difficulty: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (
        !formData.questionNumber ||
        !formData.topic ||
        !formData.problemStatement ||
        !formData.difficulty
      ) {
        toast.error("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      const payload = {
        ...formData,
        questionNumber: parseInt(formData.questionNumber, 10),
      };

      const response = await axios.patch(`/api/dsa/${id}`, payload);

      if (response.data.success) {
        toast.success("Question updated successfully!");
        router.push(`/dsa/${id}`);
      } else {
        toast.error(response.data.error || "Failed to update question");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-6 py-6">
      {/* Header Row: Back Arrow + Title (centered) */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/dsa/${id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900 flex-1 text-center">
          Edit Question
        </h1>
        <div className="w-[72px]"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Question Number <span className="text-red-500">*</span>
            </label>
            <Input
              name="questionNumber"
              type="number"
              placeholder="e.g. 128"
              className="mt-2"
              value={formData.questionNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Topic <span className="text-red-500">*</span>
            </label>
            <Input
              name="topic"
              placeholder="e.g. Dynamic Programming"
              className="mt-2"
              value={formData.topic}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Problem Statement <span className="text-red-500">*</span>
          </label>
          <Input
            name="problemStatement"
            placeholder="e.g. Longest Increasing Subsequence"
            className="mt-2"
            value={formData.problemStatement}
            onChange={handleChange}
          />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Practice Link
            </label>
            <Input
              name="practiceLink"
              placeholder="https://leetcode.com/..."
              className="mt-2"
              value={formData.practiceLink}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Difficulty <span className="text-red-500">*</span>
            </label>
            <Select
              onValueChange={handleDifficultyChange}
              value={formData.difficulty}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">
                  <span className="text-green-600 font-medium">Easy</span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="text-blue-600 font-medium">Medium</span>
                </SelectItem>
                <SelectItem value="hard">
                  <span className="text-red-600 font-medium">Hard</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <div className="mt-2">
            <Button
              type="button"
              variant={formData.completed ? "default" : "outline"}
              className={
                formData.completed ? "bg-green-600 hover:bg-green-700" : ""
              }
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  completed: !prev.completed,
                }))
              }
            >
              {formData.completed ? "Completed" : "Not Completed"}
            </Button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Notes{" "}
            <span className="text-xs text-gray-400 font-normal">
              (Supports Markdown: # heading, - bullets, **bold**)
            </span>
          </label>
          <Textarea
            name="notes"
            rows={10}
            className="mt-2"
            placeholder={`## Steps:
- Step 1: Initialize variables
- Step 2: Loop through array

### Time Complexity:
**O(n)**`}
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        {/* Code */}
        <div>
          <label className="text-sm font-medium text-gray-700">Code</label>
          <Textarea
            name="code"
            rows={6}
            className="mt-2 font-mono"
            value={formData.code}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Update Question"
          )}
        </Button>
      </form>
    </div>
  );
};

export default EditQuestion;
