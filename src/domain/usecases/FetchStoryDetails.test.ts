import {
  FetchStoryDetailsUseCase,
  IStoryRepository,
} from "./FetchStoryDetails";
import { StoryEntity } from "../entities";

describe("FetchStoryDetailsUseCase", () => {
  let mockRepository: jest.Mocked<IStoryRepository>;
  let useCase: FetchStoryDetailsUseCase;

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    mockRepository = {
      getTopStories: jest.fn(),
      getStoryById: jest.fn(),
      getStoriesByIds: jest.fn(),
    };
    useCase = new FetchStoryDetailsUseCase(mockRepository);
  });

  describe("execute()", () => {
    it("should fetch and return story successfully", async () => {
      const mockStory = new StoryEntity(
        123,
        "Test Story",
        42,
        "testuser",
        Date.now() / 1000,
        "https://example.com",
        10,
        "Story text",
        [1, 2, 3]
      );

      mockRepository.getStoryById.mockResolvedValue(mockStory);

      const result = await useCase.execute({ storyId: 123 });

      expect(result.story).toBeInstanceOf(StoryEntity);
      expect(result.story?.id).toBe(123);
      expect(result.story?.title).toBe("Test Story");
      expect(result.story?.score).toBe(42);
      expect(result.story?.by).toBe("testuser");
      expect(mockRepository.getStoryById).toHaveBeenCalledWith(123);
    });

    it("should return null when story is not found", async () => {
      mockRepository.getStoryById.mockResolvedValue(null);

      const result = await useCase.execute({ storyId: 999 });

      expect(result.story).toBeNull();
      expect(mockRepository.getStoryById).toHaveBeenCalledWith(999);
    });

    it("should handle repository errors gracefully", async () => {
      mockRepository.getStoryById.mockRejectedValue(
        new Error("Repository error")
      );

      await expect(useCase.execute({ storyId: 123 })).rejects.toThrow(
        "Repository error"
      );
      expect(mockRepository.getStoryById).toHaveBeenCalledWith(123);
    });

    it("should transform story correctly with all properties", async () => {
      const mockStory = new StoryEntity(
        456,
        "Complete Story",
        100,
        "author",
        Date.now() / 1000,
        "https://test.com",
        25,
        "Full story text",
        [10, 20, 30]
      );

      mockRepository.getStoryById.mockResolvedValue(mockStory);

      const result = await useCase.execute({ storyId: 456 });

      expect(result.story).toBeInstanceOf(StoryEntity);
      const story = result.story!;
      expect(story.id).toBe(456);
      expect(story.title).toBe("Complete Story");
      expect(story.score).toBe(100);
      expect(story.by).toBe("author");
      expect(story.url).toBe("https://test.com");
      expect(story.descendants).toBe(25);
      expect(story.text).toBe("Full story text");
      expect(story.kids).toEqual([10, 20, 30]);
    });

    it("should handle story with minimal properties", async () => {
      const mockStory = new StoryEntity(
        789,
        "Minimal Story",
        1,
        "user",
        Date.now() / 1000
        // Other properties are optional
      );

      mockRepository.getStoryById.mockResolvedValue(mockStory);

      const result = await useCase.execute({ storyId: 789 });

      expect(result.story).toBeInstanceOf(StoryEntity);
      const story = result.story!;
      expect(story.id).toBe(789);
      expect(story.title).toBe("Minimal Story");
      expect(story.score).toBe(1);
      expect(story.by).toBe("user");
      expect(story.time).toBeDefined();
      // Optional properties should be undefined
      expect(story.url).toBeUndefined();
      expect(story.descendants).toBeUndefined();
      expect(story.text).toBeUndefined();
      expect(story.kids).toBeUndefined();
    });

    it("should handle zero story ID", async () => {
      const mockStory = new StoryEntity(
        0,
        "Zero ID Story",
        5,
        "user",
        Date.now() / 1000
      );

      mockRepository.getStoryById.mockResolvedValue(mockStory);

      const result = await useCase.execute({ storyId: 0 });

      expect(result.story?.id).toBe(0);
      expect(mockRepository.getStoryById).toHaveBeenCalledWith(0);
    });

    it("should handle negative story ID", async () => {
      mockRepository.getStoryById.mockResolvedValue(null);

      const result = await useCase.execute({ storyId: -1 });

      expect(result.story).toBeNull();
      expect(mockRepository.getStoryById).toHaveBeenCalledWith(-1);
    });

    it("should handle large story ID", async () => {
      const largeId = 999999999;
      const mockStory = new StoryEntity(
        largeId,
        "Large ID Story",
        1,
        "user",
        Date.now() / 1000
      );

      mockRepository.getStoryById.mockResolvedValue(mockStory);

      const result = await useCase.execute({ storyId: largeId });

      expect(result.story?.id).toBe(largeId);
      expect(mockRepository.getStoryById).toHaveBeenCalledWith(largeId);
    });

    it("should handle story with empty arrays", async () => {
      const mockStory = new StoryEntity(
        123,
        "Story with empty kids",
        10,
        "user",
        Date.now() / 1000,
        undefined,
        undefined,
        undefined,
        [] // Empty kids array
      );

      mockRepository.getStoryById.mockResolvedValue(mockStory);

      const result = await useCase.execute({ storyId: 123 });

      expect(result.story?.kids).toEqual([]);
    });

    it("should handle story with null optional properties", async () => {
      const mockStory = new StoryEntity(
        123,
        "Story with nulls",
        10,
        null as any, // null author
        Date.now() / 1000,
        null as any, // null url
        null as any, // null descendants
        null as any, // null text
        null as any // null kids
      );

      mockRepository.getStoryById.mockResolvedValue(mockStory);

      const result = await useCase.execute({ storyId: 123 });

      expect(result.story?.by).toBeNull();
      expect(result.story?.url).toBeNull();
      expect(result.story?.descendants).toBeNull();
      expect(result.story?.text).toBeNull();
      expect(result.story?.kids).toBeNull();
    });
  });

  describe("input validation", () => {
    it("should handle invalid storyId types", async () => {
      // Test with string (should still work if repository handles it)
      mockRepository.getStoryById.mockResolvedValue(null);

      const result = await useCase.execute({ storyId: "invalid" as any });

      expect(result.story).toBeNull();
    });

    it("should handle undefined storyId", async () => {
      mockRepository.getStoryById.mockResolvedValue(null);

      const result = await useCase.execute({ storyId: undefined as any });

      expect(result.story).toBeNull();
    });
  });
});
