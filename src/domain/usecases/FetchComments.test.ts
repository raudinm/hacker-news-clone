import { FetchCommentsUseCase, ICommentRepository } from "./FetchComments";
import { CommentEntity } from "../entities";

describe("FetchCommentsUseCase", () => {
  let mockRepository: jest.Mocked<ICommentRepository>;
  let useCase: FetchCommentsUseCase;

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    mockRepository = {
      getCommentsByIds: jest.fn(),
      getCommentById: jest.fn(),
    };
    useCase = new FetchCommentsUseCase(mockRepository);
  });

  describe("execute()", () => {
    it("should return empty array when commentIds is undefined", async () => {
      const result = await useCase.execute({ commentIds: undefined as any });

      expect(result.comments).toEqual([]);
      expect(mockRepository.getCommentsByIds).not.toHaveBeenCalled();
    });

    it("should return empty array when commentIds is null", async () => {
      const result = await useCase.execute({ commentIds: null as any });

      expect(result.comments).toEqual([]);
      expect(mockRepository.getCommentsByIds).not.toHaveBeenCalled();
    });

    it("should return empty array when commentIds is empty array", async () => {
      const result = await useCase.execute({ commentIds: [] });

      expect(result.comments).toEqual([]);
      expect(mockRepository.getCommentsByIds).not.toHaveBeenCalled();
    });

    it("should fetch and transform comments successfully", async () => {
      const mockComments = [
        new CommentEntity(1, Date.now() / 1000, "user1", "comment 1"),
        new CommentEntity(2, Date.now() / 1000, "user2", "comment 2"),
        new CommentEntity(3, Date.now() / 1000, "user3", "comment 3"),
      ];

      mockRepository.getCommentsByIds.mockResolvedValue(mockComments);

      const result = await useCase.execute({ commentIds: [1, 2, 3] });

      expect(result.comments).toHaveLength(3);
      expect(result.comments[0]).toBeInstanceOf(CommentEntity);
      expect(result.comments[0].id).toBe(1);
      expect(result.comments[1].id).toBe(2);
      expect(result.comments[2].id).toBe(3);
      expect(mockRepository.getCommentsByIds).toHaveBeenCalledWith([1, 2, 3]);
    });

    it("should handle single comment ID", async () => {
      const mockComments = [
        new CommentEntity(42, Date.now() / 1000, "user", "single comment"),
      ];

      mockRepository.getCommentsByIds.mockResolvedValue(mockComments);

      const result = await useCase.execute({ commentIds: [42] });

      expect(result.comments).toHaveLength(1);
      expect(result.comments[0].id).toBe(42);
      expect(mockRepository.getCommentsByIds).toHaveBeenCalledWith([42]);
    });

    it("should handle repository errors gracefully", async () => {
      mockRepository.getCommentsByIds.mockRejectedValue(
        new Error("Repository error")
      );

      await expect(useCase.execute({ commentIds: [1, 2] })).rejects.toThrow(
        "Repository error"
      );
      expect(mockRepository.getCommentsByIds).toHaveBeenCalledWith([1, 2]);
    });

    it("should transform comments correctly with all properties", async () => {
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

      mockRepository.getCommentsByIds.mockResolvedValue(mockComments);

      const result = await useCase.execute({ commentIds: [1] });

      expect(result.comments).toHaveLength(1);
      const comment = result.comments[0];
      expect(comment.id).toBe(1);
      expect(comment.by).toBe("testuser");
      expect(comment.text).toBe("test comment");
      expect(comment.kids).toEqual([2, 3]);
      expect(comment.parent).toBe(0);
      expect(comment.deleted).toBe(false);
      expect(comment.dead).toBe(false);
    });

    it("should handle comments with minimal properties", async () => {
      const mockComments = [
        new CommentEntity(1, Date.now() / 1000), // only required properties
      ];

      mockRepository.getCommentsByIds.mockResolvedValue(mockComments);

      const result = await useCase.execute({ commentIds: [1] });

      expect(result.comments).toHaveLength(1);
      const comment = result.comments[0];
      expect(comment.id).toBe(1);
      expect(comment.time).toBeDefined();
      expect(comment.by).toBeUndefined();
      expect(comment.text).toBeUndefined();
    });

    it("should handle large arrays of comment IDs", async () => {
      const commentIds = Array.from({ length: 100 }, (_, i) => i + 1);
      const mockComments = commentIds.map(
        (id) =>
          new CommentEntity(id, Date.now() / 1000, `user${id}`, `comment ${id}`)
      );

      mockRepository.getCommentsByIds.mockResolvedValue(mockComments);

      const result = await useCase.execute({ commentIds });

      expect(result.comments).toHaveLength(100);
      expect(mockRepository.getCommentsByIds).toHaveBeenCalledWith(commentIds);
    });

    it("should handle duplicate comment IDs", async () => {
      const mockComments = [
        new CommentEntity(1, Date.now() / 1000, "user1", "comment 1"),
        new CommentEntity(1, Date.now() / 1000, "user1", "comment 1"), // duplicate
      ];

      mockRepository.getCommentsByIds.mockResolvedValue(mockComments);

      const result = await useCase.execute({ commentIds: [1, 1] });

      expect(result.comments).toHaveLength(2);
      expect(mockRepository.getCommentsByIds).toHaveBeenCalledWith([1, 1]);
    });
  });

  describe("input validation", () => {
    it("should handle non-array commentIds", async () => {
      const result = await useCase.execute({
        commentIds: "not-an-array" as any,
      });

      expect(result.comments).toEqual([]);
      expect(mockRepository.getCommentsByIds).not.toHaveBeenCalled();
    });

    it("should handle repository returning undefined", async () => {
      mockRepository.getCommentsByIds.mockResolvedValue(undefined as any);

      const result = await useCase.execute({ commentIds: [1, 2] });

      expect(result.comments).toEqual([]);
      expect(mockRepository.getCommentsByIds).toHaveBeenCalledWith([1, 2]);
    });

    it("should handle repository returning null", async () => {
      mockRepository.getCommentsByIds.mockResolvedValue(null as any);

      const result = await useCase.execute({ commentIds: [1, 2] });

      expect(result.comments).toEqual([]);
      expect(mockRepository.getCommentsByIds).toHaveBeenCalledWith([1, 2]);
    });
  });
});
