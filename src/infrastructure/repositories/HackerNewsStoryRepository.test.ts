import { HackerNewsStoryRepository } from "./HackerNewsStoryRepository";
import { HackerNewsApiClient } from "../api";

describe("HackerNewsStoryRepository", () => {
  let mockApiClient: jest.Mocked<HackerNewsApiClient>;
  let repository: HackerNewsStoryRepository;

  beforeAll(() => {
    // Suppress console.error during tests to keep output clean
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore console.error after tests
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    mockApiClient = {
      getTopStoryIds: jest.fn(),
      getItem: jest.fn(),
      getItems: jest.fn(),
    } as any;
    repository = new HackerNewsStoryRepository(mockApiClient);
  });

  describe("getTopStories()", () => {
    it("should fetch and return top stories", async () => {
      const mockIds = [1, 2, 3];
      const mockStories = [
        {
          id: 1,
          title: "Story 1",
          score: 42,
          by: "user1",
          time: Date.now() / 1000,
          type: "story",
        },
        {
          id: 2,
          title: "Story 2",
          score: 25,
          by: "user2",
          time: Date.now() / 1000,
          type: "story",
        },
      ];

      mockApiClient.getTopStoryIds.mockResolvedValue(mockIds);
      mockApiClient.getItems.mockResolvedValue(mockStories);

      const result = await repository.getTopStories(2);

      expect(result).toHaveLength(2);
      expect(mockApiClient.getTopStoryIds).toHaveBeenCalledWith();
      expect(mockApiClient.getItems).toHaveBeenCalledWith([1, 2]);
    });

    it("should handle empty story list", async () => {
      mockApiClient.getTopStoryIds.mockResolvedValue([]);
      mockApiClient.getItems.mockResolvedValue([]);

      const result = await repository.getTopStories(5);

      expect(result).toEqual([]);
    });
  });

  describe("getStoryById()", () => {
    it("should return story when found", async () => {
      const mockStory = {
        id: 123,
        title: "Test Story",
        score: 42,
        by: "user",
        time: Date.now() / 1000,
        type: "story",
      };
      mockApiClient.getItem.mockResolvedValue(mockStory);

      const result = await repository.getStoryById(123);

      expect(result?.id).toBe(123);
      expect(result?.title).toBe("Test Story");
    });

    it("should return null when story not found", async () => {
      mockApiClient.getItem.mockResolvedValue(null);

      const result = await repository.getStoryById(999);

      expect(result).toBeNull();
    });

    it("should handle API errors", async () => {
      mockApiClient.getItem.mockRejectedValue(new Error("API Error"));

      const result = await repository.getStoryById(123);

      expect(result).toBeNull();
    });
  });

  describe("getStoriesByIds()", () => {
    it("should fetch multiple stories by IDs", async () => {
      const mockIds = [1, 2];
      const mockStories = [
        {
          id: 1,
          title: "Story 1",
          score: 42,
          by: "user1",
          time: Date.now() / 1000,
          type: "story",
        },
        {
          id: 2,
          title: "Story 2",
          score: 25,
          by: "user2",
          time: Date.now() / 1000,
          type: "story",
        },
      ];

      mockApiClient.getItems.mockResolvedValue(mockStories);

      const result = await repository.getStoriesByIds(mockIds);

      expect(result).toHaveLength(2);
      expect(mockApiClient.getItems).toHaveBeenCalledWith(mockIds);
    });

    it("should filter out deleted stories", async () => {
      const mockStories = [
        {
          id: 1,
          title: "Story 1",
          score: 42,
          by: "user1",
          time: Date.now() / 1000,
          type: "story",
          deleted: false,
        },
        {
          id: 2,
          title: "Deleted Story",
          score: 25,
          by: "user2",
          time: Date.now() / 1000,
          type: "story",
          deleted: true,
        },
      ];

      mockApiClient.getItems.mockResolvedValue(mockStories);

      const result = await repository.getStoriesByIds([1, 2]);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("should filter out non-story types", async () => {
      const mockStories = [
        {
          id: 1,
          title: "Story 1",
          score: 42,
          by: "user1",
          time: Date.now() / 1000,
          type: "story",
        },
        {
          id: 2,
          title: "Comment",
          score: 0,
          by: "user2",
          time: Date.now() / 1000,
          type: "comment",
        },
      ];

      mockApiClient.getItems.mockResolvedValue(mockStories);

      const result = await repository.getStoriesByIds([1, 2]);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("should handle API errors gracefully", async () => {
      mockApiClient.getItems.mockRejectedValue(new Error("API Error"));

      const result = await repository.getStoriesByIds([1, 2]);

      expect(result).toEqual([]);
    });
  });

  describe("getStoriesByCategory()", () => {
    beforeEach(() => {
      // Add missing mock methods
      mockApiClient.getNewStoryIds = jest.fn();
      mockApiClient.getAskStoryIds = jest.fn();
      mockApiClient.getShowStoryIds = jest.fn();
      mockApiClient.getJobStoryIds = jest.fn();
    });

    it("should fetch new stories", async () => {
      const mockIds = [1, 2, 3];
      const mockStories = [
        {
          id: 1,
          title: "New Story",
          score: 42,
          by: "user1",
          time: Date.now() / 1000,
          type: "story",
        },
      ];

      mockApiClient.getNewStoryIds.mockResolvedValue(mockIds);
      mockApiClient.getItems.mockResolvedValue(mockStories);

      const result = await repository.getStoriesByCategory("new", 2);

      expect(mockApiClient.getNewStoryIds).toHaveBeenCalledWith();
      expect(mockApiClient.getItems).toHaveBeenCalledWith([1, 2]);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("New Story");
    });

    it("should fetch ask stories", async () => {
      const mockIds = [4, 5];
      const mockStories = [
        {
          id: 4,
          title: "Ask HN",
          score: 15,
          by: "user2",
          time: Date.now() / 1000,
          type: "story",
        },
      ];

      mockApiClient.getAskStoryIds.mockResolvedValue(mockIds);
      mockApiClient.getItems.mockResolvedValue(mockStories);

      const result = await repository.getStoriesByCategory("ask");

      expect(mockApiClient.getAskStoryIds).toHaveBeenCalledWith();
      expect(result).toHaveLength(1);
    });

    it("should fetch show stories", async () => {
      const mockIds = [6, 7];
      const mockStories = [
        {
          id: 6,
          title: "Show HN",
          score: 30,
          by: "user3",
          time: Date.now() / 1000,
          type: "story",
        },
      ];

      mockApiClient.getShowStoryIds.mockResolvedValue(mockIds);
      mockApiClient.getItems.mockResolvedValue(mockStories);

      const result = await repository.getStoriesByCategory("show", 5);

      expect(mockApiClient.getShowStoryIds).toHaveBeenCalledWith();
      expect(result).toHaveLength(1);
    });

    it("should fetch job stories", async () => {
      const mockIds = [8, 9];
      const mockStories = [
        {
          id: 8,
          title: "Job Posting",
          score: 0,
          by: "company",
          time: Date.now() / 1000,
          type: "story",
        },
      ];

      mockApiClient.getJobStoryIds.mockResolvedValue(mockIds);
      mockApiClient.getItems.mockResolvedValue(mockStories);

      const result = await repository.getStoriesByCategory("jobs");

      expect(mockApiClient.getJobStoryIds).toHaveBeenCalledWith();
      expect(result).toHaveLength(1);
    });

    it("should throw error for unknown category", async () => {
      await expect(repository.getStoriesByCategory("unknown")).rejects.toThrow(
        "Failed to fetch unknown stories"
      );
    });

    it("should handle API errors", async () => {
      mockApiClient.getNewStoryIds.mockRejectedValue(new Error("API Error"));

      await expect(repository.getStoriesByCategory("new")).rejects.toThrow(
        "Failed to fetch new stories"
      );
    });

    it("should use default limit when not provided", async () => {
      const mockIds = Array.from({ length: 35 }, (_, i) => i + 1);
      const mockStories = [
        {
          id: 1,
          title: "Story",
          score: 1,
          by: "user",
          time: Date.now() / 1000,
          type: "story",
        },
      ];

      mockApiClient.getNewStoryIds.mockResolvedValue(mockIds);
      mockApiClient.getItems.mockResolvedValue(mockStories);

      await repository.getStoriesByCategory("new");

      expect(mockApiClient.getItems).toHaveBeenCalledWith(mockIds.slice(0, 30));
    });
  });

  describe("Error handling in getTopStories", () => {
    it("should throw error when API fails", async () => {
      mockApiClient.getTopStoryIds.mockRejectedValue(new Error("API Error"));

      await expect(repository.getTopStories(5)).rejects.toThrow(
        "Failed to fetch top stories"
      );
    });

    it("should throw error when getItems fails", async () => {
      mockApiClient.getTopStoryIds.mockResolvedValue([1, 2]);
      mockApiClient.getItems.mockRejectedValue(new Error("Items API Error"));

      await expect(repository.getTopStories(2)).rejects.toThrow(
        "Failed to fetch top stories"
      );
    });
  });
});
