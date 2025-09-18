import useSWR from "swr";
import {
  StoryController,
  CommentController,
  StoryPresenter,
  CommentPresenter,
  StoryViewModel,
  CommentViewModel,
} from "../index";

const storyController = new StoryController();
const commentController = new CommentController();

const fetchStoryDetails = async (
  storyId: number
): Promise<StoryViewModel | null> => {
  const result = await storyController.getStoryDetails(storyId);
  if (!result.success || !result.data) {
    throw new Error(result.error || "Story not found");
  }
  return StoryPresenter.present(result.data);
};

const fetchCommentsForStory = async (
  storyId: number
): Promise<CommentViewModel[]> => {
  const result = await commentController.getCommentsForStory(storyId);
  if (!result.success || !result.data) {
    return [];
  }
  return CommentPresenter.presentMultiple(result.data);
};

export const useStoryDetails = (storyId: number | null) => {
  const {
    data: story,
    error: storyError,
    isLoading: storyLoading,
    mutate: mutateStory,
  } = useSWR<StoryViewModel | null>(
    storyId ? ["story-details", storyId] : null,
    () => fetchStoryDetails(storyId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const {
    data: comments,
    error: commentsError,
    isLoading: commentsLoading,
    mutate: mutateComments,
  } = useSWR<CommentViewModel[]>(
    storyId ? ["story-comments", storyId] : null,
    () => fetchCommentsForStory(storyId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    story,
    comments: comments || [],
    isLoading: storyLoading || commentsLoading,
    error: storyError || commentsError,
    mutateStory,
    mutateComments,
  };
};
