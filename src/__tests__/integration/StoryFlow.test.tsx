import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../../app/page";

// Mock all external dependencies
jest.mock("../../application/hooks");
jest.mock("../../infrastructure/api");

describe("Story Flow Integration", () => {
  it("should load and display stories from API to UI", async () => {
    // Mock the complete flow
    const mockStories = [
      {
        id: 1,
        title: "Integration Test Story",
        score: 100,
        author: "testuser",
        timeAgo: "5 minutes ago",
        commentCount: 10,
        hasExternalUrl: true,
        displayUrl: "https://example.com",
      },
    ];

    // Setup mocks
    const mockUseTopStories = require("../../application/hooks").useTopStories;
    mockUseTopStories.mockReturnValue({
      stories: mockStories,
      isLoading: false,
      error: undefined,
    });

    render(<Home />);

    // Verify the complete flow
    await waitFor(() => {
      expect(screen.getByText("Integration Test Story")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText(/by testuser/)).toBeInTheDocument();
    });
  });

  it("should handle loading and error states in integration", async () => {
    // Mock loading state
    const mockUseTopStories = require("../../application/hooks").useTopStories;
    mockUseTopStories.mockReturnValue({
      stories: [],
      isLoading: true,
      error: undefined,
    });

    const { rerender } = render(<Home />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Mock error state
    mockUseTopStories.mockReturnValue({
      stories: [],
      isLoading: false,
      error: new Error("Network error"),
    });

    rerender(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Error: Network error")).toBeInTheDocument();
    });
  });

  it("should handle empty story list", () => {
    const mockUseTopStories = require("../../application/hooks").useTopStories;
    mockUseTopStories.mockReturnValue({
      stories: [],
      isLoading: false,
      error: undefined,
    });

    render(<Home />);

    expect(screen.getByText("Hacker News Clone")).toBeInTheDocument();
    // Should not show any stories but should not crash
  });
});
