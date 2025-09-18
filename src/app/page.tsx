"use client";

import { useTopStories } from "../application/hooks";
import StoryItem from "../components/StoryItem";

export default function Home() {
  const { stories, isLoading, error } = useTopStories(30);

  if (isLoading) return <div className="max-w-4xl mx-auto p-4">Loading...</div>;
  if (error)
    return <div className="max-w-4xl mx-auto p-4">Error: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hacker News Clone</h1>
      <div>
        {stories.map((story) => (
          <StoryItem key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
