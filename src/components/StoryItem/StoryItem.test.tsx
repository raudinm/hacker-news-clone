import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StoryItem from "../StoryItem";

describe("StoryItem", () => {
  const mockStory = {
    id: 123,
    title: "Test Story",
    url: "https://example.com",
    score: 42,
    by: "testuser",
    time: Date.now() / 1000 - 3600, // 1 hour ago
    descendants: 5,
  };

  it("renders story with external link", () => {
    render(<StoryItem story={mockStory} />);

    expect(screen.getByText("Test Story")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText(/by testuser/)).toBeInTheDocument();
    expect(screen.getByText("5 comments")).toBeInTheDocument();
  });

  it("renders story with internal link when no URL", () => {
    const storyWithoutUrl = { ...mockStory, url: undefined };
    render(<StoryItem story={storyWithoutUrl} />);

    const titleLink = screen.getByText("Test Story").closest("a");
    expect(titleLink).toHaveAttribute("href", "/item/123");
  });

  it("renders external link with correct attributes", () => {
    render(<StoryItem story={mockStory} />);

    const externalLink = screen.getByText("Test Story");
    expect(externalLink.closest("a")).toHaveAttribute(
      "href",
      "https://example.com"
    );
    expect(externalLink.closest("a")).toHaveAttribute("target", "_blank");
    expect(externalLink.closest("a")).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
  });

  it("displays time ago correctly", () => {
    render(<StoryItem story={mockStory} />);

    expect(screen.getByText(/1 hours ago/)).toBeInTheDocument();
  });

  it("handles story with no descendants", () => {
    const storyWithoutDescendants = { ...mockStory, descendants: undefined };
    render(<StoryItem story={storyWithoutDescendants} />);

    expect(screen.getByText("0 comments")).toBeInTheDocument();
  });

  it("renders comment link with correct href", () => {
    render(<StoryItem story={mockStory} />);

    const commentLink = screen.getByText("5 comments");
    expect(commentLink.closest("a")).toHaveAttribute("href", "/item/123");
  });

  it("applies correct CSS classes", () => {
    render(<StoryItem story={mockStory} />);

    const container = screen.getByText("Test Story").closest("div")
      ?.parentElement?.parentElement;
    expect(container).toHaveClass("mb-4");
  });
});
