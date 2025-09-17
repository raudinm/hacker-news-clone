"use client";

import useSWR from "swr";
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

// Fetcher for individual items
const fetchItem = (url: string) => fetch(url).then((res) => res.json());

// Custom fetcher for comments
const fetchComments = async (kids: number[]): Promise<Comment[]> => {
  if (!kids || kids.length === 0) return [];
  const commentPromises = kids.map((kidId) =>
    fetch(`https://hacker-news.firebaseio.com/v0/item/${kidId}.json`).then(
      (res) => res.json()
    )
  );
  return Promise.all(commentPromises);
};

export default function ItemPage() {
  const { id } = useParams();

  const {
    data: story,
    error: storyError,
    isLoading: storyLoading,
  } = useSWR<Story>(
    id ? `https://hacker-news.firebaseio.com/v0/item/${id}.json` : null,
    fetchItem,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const { data: comments, isLoading: commentsLoading } = useSWR<Comment[]>(
    story?.kids ? `comments-${id}` : null,
    () => fetchComments(story!.kids!),
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

  if (storyLoading)
    return <div className="max-w-4xl mx-auto p-4">Loading...</div>;
  if (storyError || !story)
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
        Comments ({comments?.length || 0})
      </h2>
      {commentsLoading ? (
        <p>Loading comments...</p>
      ) : comments && comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments?.map((comment) => (
          <CommentComponent key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
}
