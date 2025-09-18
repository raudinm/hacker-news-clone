import { StoryController } from "./StoryController";
import {
  FetchTopStoriesUseCase,
  FetchStoryDetailsUseCase,
} from "../../domain/usecases";
import { StoryEntity } from "../../domain/entities";

describe("StoryController", () => {
  let mockTopStoriesUseCase: jest.Mocked<FetchTopStoriesUseCase>;
  let mockStoryDetailsUseCase: jest.Mocked<FetchStoryDetailsUseCase>;
  let controller: StoryController;

  beforeAll(() => {
    // Suppress console.error during tests to keep output clean
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore console.error after tests
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    mockTopStoriesUseCase = {
      execute: jest.fn(),
    } as any;

    mockStoryDetailsUseCase = {
      execute: jest.fn(),
    } as any;

    // Mock the controller to use our mock use cases
    controller = new StoryController();
    // Note: In a real implementation, you'd inject the mock use cases
    // For this test, we'll mock the methods directly
    Object.defineProperty(controller, "fetchTopStoriesUseCase", {
      value: mockTopStoriesUseCase,
      writable: true,
    });
    Object.defineProperty(controller, "fetchStoryDetailsUseCase", {
      value: mockStoryDetailsUseCase,
      writable: true,
    });
  });

  it("should return success response for valid request", async () => {
    const mockStories = [
      new StoryEntity(1, "Test", 10, "user", Date.now() / 1000),
    ];
    mockTopStoriesUseCase.execute.mockResolvedValue({ stories: mockStories });

    const result = await controller.getTopStories(5);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockStories);
  });

  it("should handle use case errors gracefully", async () => {
    mockTopStoriesUseCase.execute.mockRejectedValue(
      new Error("Repository error")
    );

    const result = await controller.getTopStories(5);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to fetch top stories");
  });

  it("should return empty array when no stories found", async () => {
    mockTopStoriesUseCase.execute.mockResolvedValue({ stories: [] });

    const result = await controller.getTopStories(5);

    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });

  describe("getStoryDetails()", () => {
    it("should return success response for valid story ID", async () => {
      const mockStory = new StoryEntity(
        123,
        "Test Story",
        10,
        "author",
        Date.now() / 1000
      );
      mockStoryDetailsUseCase.execute.mockResolvedValue({ story: mockStory });

      const result = await controller.getStoryDetails(123);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStory);
      expect(mockStoryDetailsUseCase.execute).toHaveBeenCalledWith({
        storyId: 123,
      });
    });

    it("should handle use case errors gracefully", async () => {
      mockStoryDetailsUseCase.execute.mockRejectedValue(
        new Error("Story not found")
      );

      const result = await controller.getStoryDetails(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch story details");
      expect(result.data).toBe(null);
      expect(mockStoryDetailsUseCase.execute).toHaveBeenCalledWith({
        storyId: 999,
      });
    });

    it("should handle zero story ID", async () => {
      const mockStory = new StoryEntity(
        0,
        "Zero ID Story",
        1,
        "author",
        Date.now() / 1000
      );
      mockStoryDetailsUseCase.execute.mockResolvedValue({ story: mockStory });

      const result = await controller.getStoryDetails(0);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStory);
    });

    it("should handle negative story ID", async () => {
      mockStoryDetailsUseCase.execute.mockRejectedValue(
        new Error("Invalid story ID")
      );

      const result = await controller.getStoryDetails(-1);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch story details");
      expect(result.data).toBe(null);
    });
  });
});
