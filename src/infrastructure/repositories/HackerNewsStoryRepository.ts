import { StoryEntity } from "../../domain/entities";
import { IStoryRepository } from "../../domain/repositories";
import { HackerNewsApiClient } from "../api/HackerNewsApiClient";

export class HackerNewsStoryRepository implements IStoryRepository {
  constructor(
    private readonly apiClient: HackerNewsApiClient = new HackerNewsApiClient()
  ) {}

  async getTopStories(limit: number = 30): Promise<StoryEntity[]> {
    try {
      const storyIds = await this.apiClient.getTopStoryIds();
      const topIds = storyIds.slice(0, limit);
      const stories = await this.apiClient.getItems(topIds);

      return stories
        .filter((story) => story && !story.deleted && story.type === "story")
        .map(
          (story) =>
            new StoryEntity(
              story.id,
              story.title,
              story.score,
              story.by,
              story.time,
              story.url,
              story.descendants,
              story.text,
              story.kids
            )
        );
    } catch (error) {
      console.error("Error fetching top stories:", error);
      throw new Error("Failed to fetch top stories");
    }
  }

  async getStoryById(id: number): Promise<StoryEntity | null> {
    try {
      const story = await this.apiClient.getItem(id);

      if (!story || story.deleted || story.type !== "story") {
        return null;
      }

      return new StoryEntity(
        story.id,
        story.title,
        story.score,
        story.by,
        story.time,
        story.url,
        story.descendants,
        story.text,
        story.kids
      );
    } catch (error) {
      console.error(`Error fetching story ${id}:`, error);
      return null;
    }
  }

  async getStoriesByIds(ids: number[]): Promise<StoryEntity[]> {
    try {
      const stories = await this.apiClient.getItems(ids);

      return stories
        .filter((story) => story && !story.deleted && story.type === "story")
        .map(
          (story) =>
            new StoryEntity(
              story.id,
              story.title,
              story.score,
              story.by,
              story.time,
              story.url,
              story.descendants,
              story.text,
              story.kids
            )
        );
    } catch (error) {
      console.error("Error fetching stories by IDs:", error);
      return [];
    }
  }

  async getStoriesByCategory(
    category: string,
    limit: number = 30
  ): Promise<StoryEntity[]> {
    try {
      let storyIds: number[];

      switch (category.toLowerCase()) {
        case "new":
          storyIds = await this.apiClient.getNewStoryIds();
          break;
        case "ask":
          storyIds = await this.apiClient.getAskStoryIds();
          break;
        case "show":
          storyIds = await this.apiClient.getShowStoryIds();
          break;
        case "jobs":
          storyIds = await this.apiClient.getJobStoryIds();
          break;
        default:
          throw new Error(`Unknown category: ${category}`);
      }

      const topIds = storyIds.slice(0, limit);
      const stories = await this.apiClient.getItems(topIds);

      return stories
        .filter((story) => story && !story.deleted && story.type === "story")
        .map(
          (story) =>
            new StoryEntity(
              story.id,
              story.title,
              story.score,
              story.by,
              story.time,
              story.url,
              story.descendants,
              story.text,
              story.kids
            )
        );
    } catch (error) {
      console.error(`Error fetching ${category} stories:`, error);
      throw new Error(`Failed to fetch ${category} stories`);
    }
  }
}
