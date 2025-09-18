import { StoryEntity } from "../entities";

export interface FetchTopStoriesInput {
  limit?: number;
}

export interface FetchTopStoriesOutput {
  stories: StoryEntity[];
}

export interface IFetchTopStoriesUseCase {
  execute(input: FetchTopStoriesInput): Promise<FetchTopStoriesOutput>;
}

export class FetchTopStoriesUseCase implements IFetchTopStoriesUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(input: FetchTopStoriesInput): Promise<FetchTopStoriesOutput> {
    const limit = input.limit || 30;
    const stories = await this.storyRepository.getTopStories(limit);

    return {
      stories: stories.map(
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
      ),
    };
  }
}

// Repository interface that will be implemented in the infrastructure layer
export interface IStoryRepository {
  getTopStories(limit: number): Promise<StoryEntity[]>;
  getStoryById(id: number): Promise<StoryEntity | null>;
  getStoriesByIds(ids: number[]): Promise<StoryEntity[]>;
}
