import type React from "react";
import { useState } from "react";
import { Button } from "./Button";

// Simple class merger function
function mergeClasses(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SearchBar({
  onSearch,
  placeholder = "Search records...",
  className,
  size = "md",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const getSizeClasses = (componentSize: string) => {
    switch (componentSize) {
      case "sm":
        return "h-10 text-sm";
      case "lg":
        return "h-14 text-lg";
      default:
        return "h-12 text-base";
    }
  };

  const getButtonHeight = (componentSize: string) => {
    switch (componentSize) {
      case "sm":
        return "h-10";
      case "lg":
        return "h-14";
      default:
        return "h-12";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={mergeClasses("flex w-full", className)}
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={mergeClasses(
            "w-full rounded-l-lg border border-r-0 border-border bg-input px-4 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            getSizeClasses(size)
          )}
        />
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <Button
        type="submit"
        className={mergeClasses("rounded-l-none", getButtonHeight(size))}
      >
        Search
      </Button>
    </form>
  );
}
