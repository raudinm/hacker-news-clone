import {
  FetchTopStoriesUseCase,
  FetchStoryDetailsUseCase,
} from "../../domain/usecases";
import { IStoryRepository } from "../../domain/repositories";
import { HackerNewsStoryRepository } from "../../infrastructure/repositories";

export class StoryController {
  private readonly fetchTopStoriesUseCase: FetchTopStoriesUseCase;
  private readonly fetchStoryDetailsUseCase: FetchStoryDetailsUseCase;

  constructor(
    storyRepository: IStoryRepository = new HackerNewsStoryRepository()
  ) {
    this.fetchTopStoriesUseCase = new FetchTopStoriesUseCase(storyRepository);
    this.fetchStoryDetailsUseCase = new FetchStoryDetailsUseCase(
      storyRepository
    );
  }

  /**
   * Fetches top stories with optional limit
   */
  async getTopStories(limit?: number) {
    try {
      const result = await this.fetchTopStoriesUseCase.execute({ limit });
      return {
        success: true,
        data: result.stories,
      };
    } catch (error) {
      console.error("Error in StoryController.getTopStories:", error);
      return {
        success: false,
        error: "Failed to fetch top stories",
        data: [],
      };
    }
  }

  /**
   * Fetches story details by ID
   */
  async getStoryDetails(storyId: number) {
    try {
      const result = await this.fetchStoryDetailsUseCase.execute({ storyId });
      return {
        success: true,
        data: result.story,
      };
    } catch (error) {
      console.error("Error in StoryController.getStoryDetails:", error);
      return {
        success: false,
        error: "Failed to fetch story details",
        data: null,
      };
    }
  }
}
