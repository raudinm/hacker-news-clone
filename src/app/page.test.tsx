import { render, screen, waitFor } from "@testing-library/react";
import Home from "./page";

// Mock the custom hook
jest.mock("@/application/hooks", () => ({
  useTopStories: jest.fn(),
}));

describe("Home Page", () => {
  const mockUseTopStories = require("@/application/hooks").useTopStories;
  it("should render loading state", () => {
    mockUseTopStories.mockReturnValue({
      stories: [],
      isLoading: true,
      error: undefined,
    });

    render(<Home />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render error state", () => {
    const errorMessage = "Failed to fetch stories";
    mockUseTopStories.mockReturnValue({
      stories: [],
      isLoading: false,
      error: new Error(errorMessage),
    });

    render(<Home />);

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it("should render stories list", async () => {
    const mockStories = [
      {
        id: 1,
        title: "Story 1",
        score: 42,
        author: "user1",
        timeAgo: "1 hour ago",
        commentCount: 5,
        hasExternalUrl: true,
        displayUrl: "https://example.com",
      },
      {
        id: 2,
        title: "Story 2",
        score: 25,
        author: "user2",
        timeAgo: "2 hours ago",
        commentCount: 3,
        hasExternalUrl: false,
        displayUrl: "/item/2",
      },
    ];

    mockUseTopStories.mockReturnValue({
      stories: mockStories,
      isLoading: false,
      error: undefined,
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Hacker News Clone")).toBeInTheDocument();
      expect(screen.getByText("Story 1")).toBeInTheDocument();
      expect(screen.getByText("Story 2")).toBeInTheDocument();
    });
  });

  it("should render empty state when no stories", () => {
    mockUseTopStories.mockReturnValue({
      stories: [],
      isLoading: false,
      error: undefined,
    });

    render(<Home />);

    expect(screen.getByText("Hacker News Clone")).toBeInTheDocument();
    // Should not crash and should show the title
  });

  it("should call useTopStories with default limit", () => {
    mockUseTopStories.mockReturnValue({
      stories: [],
      isLoading: false,
      error: undefined,
    });

    render(<Home />);

    expect(mockUseTopStories).toHaveBeenCalledWith(30);
  });
});
