"use client";

import { useState, useEffect } from "react";

interface Comment {
  id: number;
  by?: string;
  time: number;
  text?: string;
  kids?: number[];
}

export default function CommentComponent({
  comment,
  level = 0,
}: {
  comment: Comment;
  level?: number;
}) {
  const [replies, setReplies] = useState<Comment[]>([]);

  const timeAgo = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    return `${minutes} minutes ago`;
  };

  useEffect(() => {
    if (comment.kids) {
      const fetchReplies = async () => {
        try {
          const replyPromises = comment.kids!.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
              (res) => res.json()
            )
          );
          const repliesData: Comment[] = await Promise.all(replyPromises);
          setReplies(repliesData);
        } catch (error) {
          console.error("Error fetching replies:", error);
        }
      };
      fetchReplies();
    }
  }, [comment.kids]);

  if (!comment.text) return null; // deleted or no text

  return (
    <div
      style={{ marginLeft: level * 20 }}
      className="mb-4 border-l-2 border-gray-200 pl-4"
    >
      <p className="text-sm text-gray-600 mb-1">
        by {comment.by || "anonymous"} {timeAgo(comment.time)}
      </p>
      <div
        dangerouslySetInnerHTML={{ __html: comment.text }}
        className="text-sm"
      />
      {replies.map((reply) => (
        <CommentComponent key={reply.id} comment={reply} level={level + 1} />
      ))}
    </div>
  );
}
