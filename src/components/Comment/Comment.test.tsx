import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommentComponent from "../Comment";

// Mock SWR
jest.mock("swr");

describe("CommentComponent", () => {
  const mockComment = {
    id: 456,
    by: "commenter",
    time: Date.now() / 1000 - 1800, // 30 minutes ago
    text: "This is a test comment",
    kids: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders comment with author and time", () => {
    // Mock SWR to return no replies
    const mockUseSWR = jest.fn(() => ({
      data: [],
      error: undefined,
      isLoading: false,
    }));
    require("swr").default = mockUseSWR;

    render(<CommentComponent comment={mockComment} />);

    expect(screen.getByText(/by commenter/)).toBeInTheDocument();
    expect(screen.getByText(/30 minutes ago/)).toBeInTheDocument();
    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
  });

  it("renders anonymous for comments without author", () => {
    const commentWithoutAuthor = { ...mockComment, by: undefined };
    const mockUseSWR = jest.fn(() => ({
      data: [],
      error: undefined,
      isLoading: false,
    }));
    require("swr").default = mockUseSWR;

    render(<CommentComponent comment={commentWithoutAuthor} />);

    expect(screen.getByText(/by anonymous/)).toBeInTheDocument();
  });

  it("does not render deleted comments", () => {
    const deletedComment = { ...mockComment, text: undefined };
    const mockUseSWR = jest.fn(() => ({
      data: [],
      error: undefined,
      isLoading: false,
    }));
    require("swr").default = mockUseSWR;

    const { container } = render(<CommentComponent comment={deletedComment} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows loading state for replies", () => {
    const mockUseSWR = jest.fn(() => ({
      data: undefined,
      error: undefined,
      isLoading: true,
    }));
    require("swr").default = mockUseSWR;

    render(<CommentComponent comment={mockComment} />);

    expect(screen.getByText("Loading replies...")).toBeInTheDocument();
  });
});
