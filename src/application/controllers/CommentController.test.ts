import { CommentController } from "./CommentController";
import { FetchCommentsUseCase } from "../../domain/usecases";
import { CommentEntity } from "../../domain/entities";

describe("CommentController", () => {
  let mockUseCase: jest.Mocked<FetchCommentsUseCase>;
  let controller: CommentController;

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn(),
    } as any;

    controller = new CommentController();
    Object.defineProperty(controller, "fetchCommentsUseCase", {
      value: mockUseCase,
      writable: true,
    });
  });

  describe("getComments()", () => {
    it("should return success response for valid comments", async () => {
      const mockComments = [
        new CommentEntity(1, Date.now() / 1000, "user1", "comment 1"),
        new CommentEntity(2, Date.now() / 1000, "user2", "comment 2"),
      ];

      mockUseCase.execute.mockResolvedValue({ comments: mockComments });

      const result = await controller.getComments([1, 2]);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockComments);
      expect(result.error).toBeUndefined();
      expect(mockUseCase.execute).toHaveBeenCalledWith({ commentIds: [1, 2] });
    });

    it("should return success response for empty comment IDs array", async () => {
      mockUseCase.execute.mockResolvedValue({ comments: [] });

      const result = await controller.getComments([]);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(mockUseCase.execute).toHaveBeenCalledWith({ commentIds: [] });
    });

    it("should return success response for single comment ID", async () => {
      const mockComments = [
        new CommentEntity(42, Date.now() / 1000, "user", "single comment"),
      ];

      mockUseCase.execute.mockResolvedValue({ comments: mockComments });

      const result = await controller.getComments([42]);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockComments);
      expect(mockUseCase.execute).toHaveBeenCalledWith({ commentIds: [42] });
    });

    it("should handle use case errors gracefully", async () => {
      mockUseCase.execute.mockRejectedValue(new Error("Use case error"));

      const result = await controller.getComments([1, 2]);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch story comments");
      expect(result.data).toEqual([]);
      expect(mockUseCase.execute).toHaveBeenCalledWith({ commentIds: [1, 2] });
    });

    it("should handle large arrays of comment IDs", async () => {
      const commentIds = Array.from({ length: 50 }, (_, i) => i + 1);
      const mockComments = commentIds.map(
        (id) =>
          new CommentEntity(id, Date.now() / 1000, `user${id}`, `comment ${id}`)
      );

      mockUseCase.execute.mockResolvedValue({ comments: mockComments });

      const result = await controller.getComments(commentIds);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(50);
      expect(mockUseCase.execute).toHaveBeenCalledWith({ commentIds });
    });

    it("should handle comments with all properties", async () => {
      const mockComments = [
        new CommentEntity(
          1,
          Date.now() / 1000,
          "testuser",
          "test comment",
          [2, 3],
          0,
          false,
          false
        ),
      ];

      mockUseCase.execute.mockResolvedValue({ comments: mockComments });

      const result = await controller.getComments([1]);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      const comment = result.data[0];
      expect(comment.id).toBe(1);
      expect(comment.by).toBe("testuser");
      expect(comment.text).toBe("test comment");
      expect(comment.kids).toEqual([2, 3]);
      expect(comment.parent).toBe(0);
      expect(comment.deleted).toBe(false);
      expect(comment.dead).toBe(false);
    });
  });

  describe("getCommentsForStory()", () => {
    let mockStoryController: any;

    beforeEach(() => {
      mockStoryController = {
        getStoryDetails: jest.fn(),
      };

      // Mock the dynamic import and StoryController constructor
      jest
        .spyOn(require("./StoryController"), "StoryController")
        .mockImplementation(() => mockStoryController);
    });

    it("should fetch comments for a valid story", async () => {
      const mockStory = {
        id: 123,
        title: "Test Story",
        score: 10,
        by: "author",
        time: Date.now() / 1000,
        kids: [1, 2, 3],
      };

      const mockComments = [
        new CommentEntity(1, Date.now() / 1000, "user1", "comment 1"),
        new CommentEntity(2, Date.now() / 1000, "user2", "comment 2"),
        new CommentEntity(3, Date.now() / 1000, "user3", "comment 3"),
      ];

      mockStoryController.getStoryDetails.mockResolvedValue({
        success: true,
        data: mockStory,
      });

      mockUseCase.execute.mockResolvedValue({ comments: mockComments });

      const result = await controller.getCommentsForStory(123);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockComments);
      expect(mockStoryController.getStoryDetails).toHaveBeenCalledWith(123);
      expect(mockUseCase.execute).toHaveBeenCalledWith({
        commentIds: [1, 2, 3],
      });
    });

    it("should handle story with no comments", async () => {
      const mockStory = {
        id: 456,
        title: "Story with no comments",
        score: 5,
        by: "author",
        time: Date.now() / 1000,
        kids: [], // No comments
      };

      mockStoryController.getStoryDetails.mockResolvedValue({
        success: true,
        data: mockStory,
      });

      mockUseCase.execute.mockResolvedValue({ comments: [] });

      const result = await controller.getCommentsForStory(456);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(mockUseCase.execute).toHaveBeenCalledWith({ commentIds: [] });
    });

    it("should handle story with undefined kids", async () => {
      const mockStory = {
        id: 789,
        title: "Story with undefined kids",
        score: 1,
        by: "author",
        time: Date.now() / 1000,
        kids: undefined,
      };

      mockStoryController.getStoryDetails.mockResolvedValue({
        success: true,
        data: mockStory,
      });

      mockUseCase.execute.mockResolvedValue({ comments: [] });

      const result = await controller.getCommentsForStory(789);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(mockUseCase.execute).toHaveBeenCalledWith({ commentIds: [] });
    });

    it("should handle story not found", async () => {
      mockStoryController.getStoryDetails.mockResolvedValue({
        success: false,
        error: "Story not found",
      });

      const result = await controller.getCommentsForStory(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Story not found");
      expect(result.data).toEqual([]);
      expect(mockUseCase.execute).not.toHaveBeenCalled();
    });

    it("should handle story controller error", async () => {
      mockStoryController.getStoryDetails.mockRejectedValue(
        new Error("Controller error")
      );

      const result = await controller.getCommentsForStory(123);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch comments");
      expect(result.data).toEqual([]);
    });

    it("should handle story with null data", async () => {
      mockStoryController.getStoryDetails.mockResolvedValue({
        success: true,
        data: null,
      });

      const result = await controller.getCommentsForStory(123);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Story not found");
      expect(result.data).toEqual([]);
    });

    it("should handle use case error after getting story", async () => {
      const mockStory = {
        id: 123,
        title: "Test Story",
        score: 10,
        by: "author",
        time: Date.now() / 1000,
        kids: [1, 2],
      };

      mockStoryController.getStoryDetails.mockResolvedValue({
        success: true,
        data: mockStory,
      });

      mockUseCase.execute.mockRejectedValue(new Error("Use case error"));

      const result = await controller.getCommentsForStory(123);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch story comments");
      expect(result.data).toEqual([]);
    });

    it("should handle zero story ID", async () => {
      const mockStory = {
        id: 0,
        title: "Zero ID Story",
        score: 1,
        by: "author",
        time: Date.now() / 1000,
        kids: [1],
      };

      mockStoryController.getStoryDetails.mockResolvedValue({
        success: true,
        data: mockStory,
      });

      const mockComments = [
        new CommentEntity(1, Date.now() / 1000, "user", "comment"),
      ];

      mockUseCase.execute.mockResolvedValue({ comments: mockComments });

      const result = await controller.getCommentsForStory(0);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockComments);
    });
  });

  describe("edge cases", () => {
    it("should handle negative story IDs", async () => {
      const mockStoryController = {
        getStoryDetails: jest.fn().mockResolvedValue({
          success: false,
          error: "Story not found",
        }),
      };

      jest
        .spyOn(require("./StoryController"), "StoryController")
        .mockImplementation(() => mockStoryController);

      const result = await controller.getCommentsForStory(-1);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Story not found");
    });

    it("should handle very large story IDs", async () => {
      const largeId = 999999999;
      const mockStoryController = {
        getStoryDetails: jest.fn().mockResolvedValue({
          success: false,
          error: "Story not found",
        }),
      };

      jest
        .spyOn(require("./StoryController"), "StoryController")
        .mockImplementation(() => mockStoryController);

      const result = await controller.getCommentsForStory(largeId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Story not found");
    });
  });
});
