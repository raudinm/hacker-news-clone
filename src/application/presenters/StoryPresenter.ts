import { StoryEntity } from "../../domain/entities";

export interface StoryViewModel {
  id: number;
  title: string;
  url?: string;
  score: number;
  author: string;
  timeAgo: string;
  commentCount: number;
  hasExternalUrl: boolean;
  displayUrl: string;
  text?: string;
}

export class StoryPresenter {
  /**
   * Transforms a StoryEntity into a StoryViewModel for UI consumption
   */
  static present(story: StoryEntity): StoryViewModel {
    return {
      id: story.id,
      title: story.title,
      url: story.url,
      score: story.score,
      author: story.by,
      timeAgo: story.getTimeAgo(),
      commentCount: story.descendants || 0,
      hasExternalUrl: story.hasExternalUrl(),
      displayUrl: story.getDisplayUrl(),
      text: story.text,
    };
  }

  /**
   * Transforms multiple StoryEntities into StoryViewModels
   */
  static presentMultiple(stories: StoryEntity[]): StoryViewModel[] {
    return stories.map((story) => this.present(story));
  }
}
