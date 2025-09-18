"use client";

import { useParams } from "next/navigation";
import { useStoryDetails } from "@/application";
import CommentComponent from "../../../components/Comment";

export default function ItemPage() {
  const { id } = useParams();
  const storyId = parseInt(id as string);

  const { story, comments, isLoading, error } = useStoryDetails(storyId);

  if (isLoading) return <div className="max-w-4xl mx-auto p-4">Loading...</div>;
  if (error)
    return <div className="max-w-4xl mx-auto p-4">Error: {error.message}</div>;
  if (!story)
    return <div className="max-w-4xl mx-auto p-4">Story not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-2">{story.title}</h1>
      {story.hasExternalUrl && (
        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline mb-2 block"
        >
          {story.url}
        </a>
      )}
      <p className="text-sm text-gray-600 mb-4">
        {story.score} points by {story.author} {story.timeAgo} |{" "}
        {story.commentCount} comments
      </p>
      {story.text && (
        <div
          dangerouslySetInnerHTML={{ __html: story.text }}
          className="mb-4 text-sm"
        />
      )}
      <h2 className="text-lg font-semibold mb-2">
        Comments ({comments.length})
      </h2>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <CommentComponent key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
}
