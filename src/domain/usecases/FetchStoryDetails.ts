import { StoryEntity } from "../entities";

export interface FetchStoryDetailsInput {
  storyId: number;
}

export interface FetchStoryDetailsOutput {
  story: StoryEntity | null;
}

export interface IFetchStoryDetailsUseCase {
  execute(input: FetchStoryDetailsInput): Promise<FetchStoryDetailsOutput>;
}

export class FetchStoryDetailsUseCase implements IFetchStoryDetailsUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(
    input: FetchStoryDetailsInput
  ): Promise<FetchStoryDetailsOutput> {
    const story = await this.storyRepository.getStoryById(input.storyId);

    if (!story) {
      return { story: null };
    }

    return {
      story: new StoryEntity(
        story.id,
        story.title,
        story.score,
        story.by,
        story.time,
        story.url,
        story.descendants,
        story.text,
        story.kids
      ),
    };
  }
}

// Repository interface (same as in FetchTopStories.ts)
export interface IStoryRepository {
  getTopStories(limit: number): Promise<StoryEntity[]>;
  getStoryById(id: number): Promise<StoryEntity | null>;
  getStoriesByIds(ids: number[]): Promise<StoryEntity[]>;
}
