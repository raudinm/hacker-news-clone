"use client";

import { useState, useEffect } from "react";
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

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json"
        );
        const ids: number[] = await response.json();
        const topIds = ids.slice(0, 30);
        const storyPromises = topIds.map((id) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
            (res) => res.json()
          )
        );
        const storiesData: Story[] = await Promise.all(storyPromises);
        setStories(storiesData);
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto p-4">Loading...</div>;

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
