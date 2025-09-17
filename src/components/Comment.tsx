"use client";

import useSWR from "swr";

interface Comment {
  id: number;
  by?: string;
  time: number;
  text?: string;
  kids?: number[];
}

// Fetcher for comment replies
const fetchReplies = async (kids: number[]): Promise<Comment[]> => {
  if (!kids || kids.length === 0) return [];
  const replyPromises = kids.map((id) =>
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) =>
      res.json()
    )
  );
  return Promise.all(replyPromises);
};

export default function CommentComponent({
  comment,
  level = 0,
}: {
  comment: Comment;
  level?: number;
}) {
  const { data: replies, isLoading } = useSWR<Comment[]>(
    comment.kids ? `replies-${comment.id}` : null,
    () => fetchReplies(comment.kids!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

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
      {isLoading ? (
        <div className="text-sm text-gray-500 mt-2">Loading replies...</div>
      ) : (
        replies?.map((reply) => (
          <CommentComponent key={reply.id} comment={reply} level={level + 1} />
        ))
      )}
    </div>
  );
}
