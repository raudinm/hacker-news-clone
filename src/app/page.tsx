"use client";

import useSWR from "swr";
import StoryItem from "../components/StoryItem";

interface Story {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
}

// Custom fetcher for top stories
const fetchTopStories = async (): Promise<Story[]> => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const ids: number[] = await response.json();
  const topIds = ids.slice(0, 30);
  const storyPromises = topIds.map((id) =>
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) =>
      res.json()
    )
  );
  const storiesData: Story[] = await Promise.all(storyPromises);
  return storiesData;
};

export default function Home() {
  const {
    data: stories,
    error,
    isLoading,
  } = useSWR<Story[]>("top-stories", fetchTopStories, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 300000, // Refresh every 5 minutes
  });

  if (isLoading) return <div className="max-w-4xl mx-auto p-4">Loading...</div>;
  if (error)
    return <div className="max-w-4xl mx-auto p-4">Error loading stories</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hacker News Clone</h1>
      <div>
        {stories?.map((story) => (
          <StoryItem key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
