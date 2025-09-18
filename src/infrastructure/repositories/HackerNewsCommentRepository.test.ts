import { HackerNewsCommentRepository } from "./HackerNewsCommentRepository";
import { HackerNewsApiClient } from "../api/HackerNewsApiClient";
import { CommentEntity } from "../../domain/entities";

// Mock the API client
jest.mock("../api/HackerNewsApiClient");

describe("HackerNewsCommentRepository", () => {
  let repository: HackerNewsCommentRepository;
  let mockApiClient: jest.Mocked<HackerNewsApiClient>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockApiClient =
      new HackerNewsApiClient() as jest.Mocked<HackerNewsApiClient>;
    repository = new HackerNewsCommentRepository(mockApiClient);
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("getCommentsByIds", () => {
    it("should return empty array for empty ids", async () => {
      const result = await repository.getCommentsByIds([]);
      expect(result).toEqual([]);
      expect(mockApiClient.getItems).not.toHaveBeenCalled();
    });

    it("should return empty array for null ids", async () => {
      const result = await repository.getCommentsByIds(null as any);
      expect(result).toEqual([]);
      expect(mockApiClient.getItems).not.toHaveBeenCalled();
    });

    it("should fetch and filter comments successfully", async () => {
      const mockComments = [
        {
          id: 1,
          time: 1234567890,
          by: "user1",
          text: "Comment 1",
          kids: [2],
          parent: 100,
          deleted: false,
          dead: false,
          type: "comment",
        },
        {
          id: 2,
          time: 1234567891,
          by: "user2",
          text: "Comment 2",
          kids: [],
          parent: 1,
          deleted: false,
          dead: false,
          type: "comment",
        },
        null, // Simulate missing comment
        {
          id: 3,
          time: 1234567892,
          by: "user3",
          text: "Deleted comment",
          kids: [],
          parent: 100,
          deleted: true,
          dead: false,
          type: "comment",
        },
      ];

      mockApiClient.getItems.mockResolvedValue(mockComments);

      const result = await repository.getCommentsByIds([1, 2, 3, 4]);

      expect(mockApiClient.getItems).toHaveBeenCalledWith([1, 2, 3, 4]);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(CommentEntity);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it("should filter out non-comment types", async () => {
      const mockComments = [
        {
          id: 1,
          time: 1234567890,
          by: "user1",
          text: "Story",
          kids: [],
          parent: 0,
          deleted: false,
          dead: false,
          type: "story", // Not a comment
        },
      ];

      mockApiClient.getItems.mockResolvedValue(mockComments);

      const result = await repository.getCommentsByIds([1]);

      expect(result).toHaveLength(0);
    });

    it("should handle API errors gracefully", async () => {
      mockApiClient.getItems.mockRejectedValue(new Error("API Error"));

      const result = await repository.getCommentsByIds([1, 2]);

      expect(result).toEqual([]);
    });
  });

  describe("getCommentById", () => {
    it("should return null for non-existent comment", async () => {
      mockApiClient.getItem.mockResolvedValue(null);

      const result = await repository.getCommentById(999);

      expect(mockApiClient.getItem).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });

    it("should return null for deleted comment", async () => {
      const mockComment = {
        id: 1,
        time: 1234567890,
        by: "user1",
        text: "Deleted comment",
        kids: [],
        parent: 100,
        deleted: true,
        dead: false,
        type: "comment",
      };

      mockApiClient.getItem.mockResolvedValue(mockComment);

      const result = await repository.getCommentById(1);

      expect(result).toBeNull();
    });

    it("should return null for dead comment", async () => {
      const mockComment = {
        id: 1,
        time: 1234567890,
        by: "user1",
        text: "Dead comment",
        kids: [],
        parent: 100,
        deleted: false,
        dead: true,
        type: "comment",
      };

      mockApiClient.getItem.mockResolvedValue(mockComment);

      const result = await repository.getCommentById(1);

      expect(result).toBeNull();
    });

    it("should return null for non-comment type", async () => {
      const mockComment = {
        id: 1,
        time: 1234567890,
        by: "user1",
        text: "Story",
        kids: [],
        parent: 0,
        deleted: false,
        dead: false,
        type: "story",
      };

      mockApiClient.getItem.mockResolvedValue(mockComment);

      const result = await repository.getCommentById(1);

      expect(result).toBeNull();
    });

    it("should return CommentEntity for valid comment", async () => {
      const mockComment = {
        id: 1,
        time: 1234567890,
        by: "user1",
        text: "Valid comment",
        kids: [2, 3],
        parent: 100,
        deleted: false,
        dead: false,
        type: "comment",
      };

      mockApiClient.getItem.mockResolvedValue(mockComment);

      const result = await repository.getCommentById(1);

      expect(result).toBeInstanceOf(CommentEntity);
      expect(result?.id).toBe(1);
      expect(result?.by).toBe("user1");
      expect(result?.text).toBe("Valid comment");
    });

    it("should handle API errors gracefully", async () => {
      mockApiClient.getItem.mockRejectedValue(new Error("API Error"));

      const result = await repository.getCommentById(1);

      expect(result).toBeNull();
    });
  });

  describe("getCommentsByStoryId", () => {
    it("should return empty array when story has no kids", async () => {
      const mockStory = {
        id: 100,
        kids: [],
      };

      mockApiClient.getItem.mockResolvedValue(mockStory);

      const result = await repository.getCommentsByStoryId(100);

      expect(mockApiClient.getItem).toHaveBeenCalledWith(100);
      expect(result).toEqual([]);
    });

    it("should return empty array when story has no kids property", async () => {
      const mockStory = {
        id: 100,
        // No kids property
      };

      mockApiClient.getItem.mockResolvedValue(mockStory);

      const result = await repository.getCommentsByStoryId(100);

      expect(result).toEqual([]);
    });

    it("should fetch comments for story with kids", async () => {
      const mockStory = {
        id: 100,
        kids: [1, 2],
      };

      const mockComments = [
        {
          id: 1,
          time: 1234567890,
          by: "user1",
          text: "Comment 1",
          kids: [],
          parent: 100,
          deleted: false,
          dead: false,
          type: "comment",
        },
      ];

      mockApiClient.getItem.mockResolvedValueOnce(mockStory);
      mockApiClient.getItems.mockResolvedValue(mockComments);

      const result = await repository.getCommentsByStoryId(100);

      expect(mockApiClient.getItem).toHaveBeenCalledWith(100);
      expect(mockApiClient.getItems).toHaveBeenCalledWith([1, 2]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("should return empty array when story not found", async () => {
      mockApiClient.getItem.mockResolvedValue(null);

      const result = await repository.getCommentsByStoryId(999);

      expect(result).toEqual([]);
    });

    it("should handle API errors gracefully", async () => {
      mockApiClient.getItem.mockRejectedValue(new Error("API Error"));

      const result = await repository.getCommentsByStoryId(100);

      expect(result).toEqual([]);
    });
  });

  describe("getCommentReplies", () => {
    it("should return empty array when comment has no kids", async () => {
      const mockComment = {
        id: 1,
        kids: [],
      };

      mockApiClient.getItem.mockResolvedValue(mockComment);

      const result = await repository.getCommentReplies(1);

      expect(result).toEqual([]);
    });

    it("should fetch replies for comment with kids", async () => {
      const mockComment = {
        id: 1,
        kids: [2, 3],
      };

      const mockReplies = [
        {
          id: 2,
          time: 1234567890,
          by: "user2",
          text: "Reply 1",
          kids: [],
          parent: 1,
          deleted: false,
          dead: false,
          type: "comment",
        },
      ];

      mockApiClient.getItem.mockResolvedValueOnce(mockComment);
      mockApiClient.getItems.mockResolvedValue(mockReplies);

      const result = await repository.getCommentReplies(1);

      expect(mockApiClient.getItem).toHaveBeenCalledWith(1);
      expect(mockApiClient.getItems).toHaveBeenCalledWith([2, 3]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it("should handle API errors gracefully", async () => {
      mockApiClient.getItem.mockRejectedValue(new Error("API Error"));

      const result = await repository.getCommentReplies(1);

      expect(result).toEqual([]);
    });
  });
});
