import { FetchTopStoriesUseCase, IStoryRepository } from "./FetchTopStories";
import { StoryEntity } from "../entities";

describe("FetchTopStoriesUseCase", () => {
  let mockRepository: jest.Mocked<IStoryRepository>;
  let useCase: FetchTopStoriesUseCase;

  beforeEach(() => {
    mockRepository = {
      getTopStories: jest.fn(),
      getStoryById: jest.fn(),
      getStoriesByIds: jest.fn(),
    };
    useCase = new FetchTopStoriesUseCase(mockRepository);
  });

  it("should fetch top stories with default limit", async () => {
    const mockStories = [
      new StoryEntity(1, "Story 1", 42, "user1", Date.now() / 1000),
      new StoryEntity(2, "Story 2", 25, "user2", Date.now() / 1000),
    ];

    mockRepository.getTopStories.mockResolvedValue(mockStories);

    const result = await useCase.execute({});

    expect(result.stories).toHaveLength(2);
    expect(mockRepository.getTopStories).toHaveBeenCalledWith(30);
  });

  it("should fetch top stories with custom limit", async () => {
    const mockStories = [
      new StoryEntity(1, "Story 1", 42, "user1", Date.now() / 1000),
    ];
    mockRepository.getTopStories.mockResolvedValue(mockStories);

    const result = await useCase.execute({ limit: 5 });

    expect(mockRepository.getTopStories).toHaveBeenCalledWith(5);
  });

  it("should transform raw stories to StoryEntity instances", async () => {
    const rawStories = [
      {
        id: 1,
        title: "Raw Story",
        score: 10,
        by: "user",
        time: Date.now() / 1000,
      },
    ];
    mockRepository.getTopStories.mockResolvedValue(rawStories as StoryEntity[]);

    const result = await useCase.execute({ limit: 1 });

    expect(result.stories[0]).toBeInstanceOf(StoryEntity);
    expect(result.stories[0].title).toBe("Raw Story");
  });
});
