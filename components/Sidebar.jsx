"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Layers, Code2, Users, BookOpen, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "MERN", path: "/mern", icon: Layers },
  { name: "DSA", path: "/dsa", icon: Code2 },
  { name: "HR", path: "/hr", icon: Users },
  { name: "Theory Subjects", path: "/theorysubject", icon: BookOpen },
];

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:block border-r border-gray-300">
        <aside
          className={cn(
            "h-full flex flex-col bg-white transition-all duration-300",
            open ? "w-60" : "w-16"
          )}
        >
          {/* Hamburger */}
          <div
            className={cn(
              "h-20 flex items-center px-3",
              open ? "justify-end" : "justify-center"
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!open)}
              className="hover:bg-gray-300"
            >
              <Menu className="h-5 w-5 text-black" />
            </Button>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <a
                  key={item.name}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md py-2.5 text-sm font-medium transition",
                    open ? "px-4" : "justify-center px-2",
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {open && <span>{item.name}</span>}
                </a>
              );
            })}
          </nav>
        </aside>
      </div>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300">
        <ul className="flex justify-around items-center h-16">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.name} className="relative group">
                <a
                  href={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center p-2",
                    isActive ? "text-black" : "text-gray-500"
                  )}
                >
                  <Icon className="h-6 w-6" />

                  {/* Tooltip */}
                  <span className="absolute -top-10 scale-0 group-hover:scale-100 transition bg-black text-white text-xs px-2 py-1 rounded-md">
                    {item.name}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
