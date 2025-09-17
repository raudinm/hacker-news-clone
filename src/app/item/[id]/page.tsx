"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommentComponent from "../../../components/Comment";

interface Story {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  text?: string;
  kids?: number[];
}

interface Comment {
  id: number;
  by?: string;
  time: number;
  text?: string;
  kids?: number[];
}

export default function ItemPage() {
  const { id } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

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
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        const data: Story = await response.json();
        setStory(data);
        if (data.kids) {
          const commentPromises = data.kids.map((kidId) =>
            fetch(
              `https://hacker-news.firebaseio.com/v0/item/${kidId}.json`
            ).then((res) => res.json())
          );
          const commentsData: Comment[] = await Promise.all(commentPromises);
          setComments(commentsData);
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto p-4">Loading...</div>;

  if (!story)
    return <div className="max-w-4xl mx-auto p-4">Story not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-2">{story.title}</h1>
      {story.url && (
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
        {story.score} points by {story.by} {timeAgo(story.time)} |{" "}
        {story.descendants || 0} comments
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
