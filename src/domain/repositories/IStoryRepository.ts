import { StoryEntity } from "../entities";

export interface IStoryRepository {
  /**
   * Fetches the top stories from Hacker News
   * @param limit - Maximum number of stories to fetch (default: 30)
   * @returns Promise resolving to array of StoryEntity objects
   */
  getTopStories(limit?: number): Promise<StoryEntity[]>;

  /**
   * Fetches a specific story by its ID
   * @param id - The story ID
   * @returns Promise resolving to StoryEntity or null if not found
   */
  getStoryById(id: number): Promise<StoryEntity | null>;

  /**
   * Fetches multiple stories by their IDs
   * @param ids - Array of story IDs
   * @returns Promise resolving to array of StoryEntity objects
   */
  getStoriesByIds(ids: number[]): Promise<StoryEntity[]>;

  /**
   * Fetches stories from a specific category
   * @param category - Category like 'new', 'ask', 'show', 'jobs'
   * @param limit - Maximum number of stories to fetch
   * @returns Promise resolving to array of StoryEntity objects
   */
  getStoriesByCategory(
    category: string,
    limit?: number
  ): Promise<StoryEntity[]>;
}
