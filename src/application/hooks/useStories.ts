import useSWR from "swr";
import { StoryController, StoryPresenter, StoryViewModel } from "../index";

const storyController = new StoryController();

export const fetchTopStories = async (
  limit: number,
  controller = storyController
): Promise<StoryViewModel[]> => {
  const result = await controller.getTopStories(limit);
  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch stories");
  }
  return StoryPresenter.presentMultiple(result.data);
};

export const useTopStories = (limit: number = 30) => {
  const { data, error, isLoading, mutate } = useSWR<StoryViewModel[]>(
    ["top-stories", limit],
    () => fetchTopStories(limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  );

  return {
    stories: data || [],
    isLoading,
    error,
    mutate,
  };
};
