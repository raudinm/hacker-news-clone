import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommentComponent from "../Comment";
import { CommentViewModel } from "../../application/presenters";

describe("CommentComponent", () => {
  const mockComment: CommentViewModel = {
    id: 456,
    author: "commenter",
    timeAgo: "30 minutes ago",
    text: "This is a test comment",
    hasContent: true,
    replyCount: 0,
    hasReplies: false,
  };

  it("renders comment with author and time", () => {
    render(<CommentComponent comment={mockComment} />);

    expect(screen.getByText(/by commenter/)).toBeInTheDocument();
    expect(screen.getByText(/30 minutes ago/)).toBeInTheDocument();
    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
  });

  it("renders anonymous for comments without author", () => {
    const commentWithoutAuthor: CommentViewModel = {
      ...mockComment,
      author: "anonymous",
    };

    render(<CommentComponent comment={commentWithoutAuthor} />);

    expect(screen.getByText(/by anonymous/)).toBeInTheDocument();
  });

  it("does not render deleted comments", () => {
    const deletedComment: CommentViewModel = {
      ...mockComment,
      hasContent: false,
      text: undefined,
    };

    const { container } = render(<CommentComponent comment={deletedComment} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows reply count when comment has replies", () => {
    const commentWithReplies: CommentViewModel = {
      ...mockComment,
      hasReplies: true,
      replyCount: 3,
    };

    render(<CommentComponent comment={commentWithReplies} />);

    expect(screen.getByText("3 replies")).toBeInTheDocument();
  });
});
