"use client";

import React, { useState, useEffect } from "react";
import { NotebookPen, Plus, Check, X, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from API on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/todo");
      if (response.data.success) {
        const fetchedTasks = response.data.data;
        const now = Date.now();

        // Handle auto-deletion for already old completed tasks
        const validTasks = [];
        for (const t of fetchedTasks) {
          if (t.completed && t.completedAt) {
            const completedTime = new Date(t.completedAt).getTime();
            if (now - completedTime > 60000) {
              // Too old, delete effectively immediately
              // We trigger delete in background to clean up DB
              removeTask(t._id, true);
              continue; // Don't add to state
            } else {
              // Schedule delete for remaining time
              const remaining = 60000 - (now - completedTime);
              setTimeout(() => removeTask(t._id, true), remaining);
            }
          }
          validTasks.push(t);
        }
        setTasks(validTasks);
      }
    } catch (error) {
      console.error("Failed to load todos", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeTask = async (id, silent = false) => {
    try {
      // Optimistically remove from UI
      setTasks((prev) => prev.filter((t) => t._id !== id));

      await axios.delete(`/api/todo/${id}`);
      if (!silent) toast.success("Task removed");
    } catch (error) {
      console.error("Failed to delete task", error);
      if (!silent) toast.error("Failed to delete task");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    if (tasks.length >= 5) {
      toast.warning("You can only add up to 5 tasks!");
      return;
    }

    try {
      const response = await axios.post("/api/todo", { text: newTask });
      if (response.data.success) {
        setTasks((prev) => [response.data.data, ...prev]);
        setNewTask("");
        setIsAdding(false);
        toast.success("Task added!");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add task");
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    // Optimistic Update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: newStatus } : t))
    );

    try {
      const response = await axios.patch(`/api/todo/${id}`, {
        completed: newStatus,
      });

      if (response.data.success) {
        if (newStatus) {
          toast.info("Task completed! Will vanish in 1 minute.");
          // Schedule removal
          setTimeout(() => removeTask(id, true), 60000);
        }

        // Update with actual server data (to get correct completedAt)
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? response.data.data : t))
        );
      }
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: !newStatus } : t))
      );
    }
  };

  return (
    <div className="relative rounded-xl border border-gray-400 bg-white px-4 py-4 min-h-[100px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-bold text-gray-900">To-Do List</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
          title="Add new task"
        >
          <NotebookPen className="h-4 w-4" />
        </button>
      </div>

      {/* Add Task Form */}
      {isAdding && (
        <form
          onSubmit={handleAddTask}
          className="flex gap-2 mb-3 animate-in slide-in-from-top-2 fade-in duration-200"
        >
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            className="h-8 text-sm"
            autoFocus
          />
          <Button type="submit" size="sm" className="h-8 w-8 p-0 shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      )}

      {/* Task List */}
      <div className="flex flex-col">
        {isLoading && tasks.length === 0 ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : tasks.length === 0 && !isAdding ? (
          <p className="text-xs text-gray-400 italic py-2">No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 transition-all duration-300 ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <button
                onClick={() => toggleComplete(task._id, task.completed)}
                className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                  task.completed
                    ? "bg-black border-black text-white"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {task.completed && <Check className="h-3 w-3" />}
              </button>
              <span
                className={`text-sm text-gray-800 break-all ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.text}
              </span>
              {/* Delete button (immediate) */}
              <button
                onClick={() => removeTask(task._id)}
                className="ml-auto text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Todo;
