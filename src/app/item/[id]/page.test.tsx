import { render, screen } from "@testing-library/react";
import ItemPage from "./page";
import { useStoryDetails } from "@/application";

// Mock the hook
jest.mock("@/application", () => ({
  useStoryDetails: jest.fn(),
}));

// Mock useParams
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

// Mock CommentComponent
jest.mock("../../../components/Comment", () => {
  return function MockCommentComponent({ comment }: { comment: any }) {
    return <div data-testid={`comment-${comment.id}`}>{comment.text}</div>;
  };
});

const mockUseParams = require("next/navigation").useParams;
const mockUseStoryDetails = useStoryDetails as jest.MockedFunction<
  typeof useStoryDetails
>;

describe("ItemPage", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "123" });
  });

  it("renders loading state", () => {
    mockUseStoryDetails.mockReturnValue({
      story: null,
      comments: [],
      isLoading: true,
      error: null,
      mutateStory: jest.fn(),
      mutateComments: jest.fn(),
    });

    render(<ItemPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    const error = new Error("Test error");
    mockUseStoryDetails.mockReturnValue({
      story: null,
      comments: [],
      isLoading: false,
      error,
      mutateStory: jest.fn(),
      mutateComments: jest.fn(),
    });

    render(<ItemPage />);

    expect(screen.getByText("Error: Test error")).toBeInTheDocument();
  });

  it("renders story not found", () => {
    mockUseStoryDetails.mockReturnValue({
      story: null,
      comments: [],
      isLoading: false,
      error: null,
      mutateStory: jest.fn(),
      mutateComments: jest.fn(),
    });

    render(<ItemPage />);

    expect(screen.getByText("Story not found")).toBeInTheDocument();
  });

  it("renders story with comments", () => {
    const mockStory = {
      id: 123,
      title: "Test Story",
      url: "https://example.com",
      hasExternalUrl: true,
      score: 42,
      author: "testuser",
      timeAgo: "2 hours ago",
      commentCount: 5,
      text: "<p>Test text</p>",
      displayUrl: "example.com",
    };
    const mockComments = [
      {
        id: 1,
        author: "user1",
        timeAgo: "1 hour ago",
        text: "Comment 1",
        hasContent: true,
        replyCount: 0,
        hasReplies: false,
      },
      {
        id: 2,
        author: "user2",
        timeAgo: "30 min ago",
        text: "Comment 2",
        hasContent: true,
        replyCount: 0,
        hasReplies: false,
      },
    ];

    mockUseStoryDetails.mockReturnValue({
      story: mockStory,
      comments: mockComments,
      isLoading: false,
      error: null,
      mutateStory: jest.fn(),
      mutateComments: jest.fn(),
    });

    render(<ItemPage />);

    expect(screen.getByText("Test Story")).toBeInTheDocument();
    expect(screen.getByText("https://example.com")).toBeInTheDocument();
    expect(
      screen.getByText("42 points by testuser 2 hours ago | 5 comments")
    ).toBeInTheDocument();
    expect(screen.getByText("Comments (2)")).toBeInTheDocument();
    expect(screen.getByTestId("comment-1")).toBeInTheDocument();
    expect(screen.getByTestId("comment-2")).toBeInTheDocument();
  });

  it("renders story without external URL", () => {
    const mockStory = {
      id: 123,
      title: "Test Story",
      url: "",
      hasExternalUrl: false,
      score: 42,
      author: "testuser",
      timeAgo: "2 hours ago",
      commentCount: 5,
      text: "<p>Test text</p>",
      displayUrl: "",
    };

    mockUseStoryDetails.mockReturnValue({
      story: mockStory,
      comments: [],
      isLoading: false,
      error: null,
      mutateStory: jest.fn(),
      mutateComments: jest.fn(),
    });

    render(<ItemPage />);

    expect(screen.queryByText("https://example.com")).not.toBeInTheDocument();
  });

  it("renders no comments message", () => {
    const mockStory = {
      id: 123,
      title: "Test Story",
      url: "",
      hasExternalUrl: false,
      score: 42,
      author: "testuser",
      timeAgo: "2 hours ago",
      commentCount: 0,
      text: "",
      displayUrl: "",
    };

    mockUseStoryDetails.mockReturnValue({
      story: mockStory,
      comments: [],
      isLoading: false,
      error: null,
      mutateStory: jest.fn(),
      mutateComments: jest.fn(),
    });

    render(<ItemPage />);

    expect(screen.getByText("No comments yet.")).toBeInTheDocument();
  });
});
