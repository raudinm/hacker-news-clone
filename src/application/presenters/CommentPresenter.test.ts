import { CommentPresenter } from "./CommentPresenter";
import { CommentEntity } from "../../domain/entities";

describe("CommentPresenter", () => {
  describe("present()", () => {
    it("should transform CommentEntity to CommentViewModel", () => {
      const comment = new CommentEntity(
        123,
        Date.now() / 1000 - 3600,
        "testuser",
        "This is a test comment",
        [456, 789],
        0,
        false,
        false
      );

      const viewModel = CommentPresenter.present(comment, 1);

      expect(viewModel.id).toBe(123);
      expect(viewModel.author).toBe("testuser");
      expect(viewModel.text).toBe("This is a test comment");
      expect(viewModel.hasContent).toBe(true);
      expect(viewModel.replyCount).toBe(2);
      expect(viewModel.hasReplies).toBe(true);
      expect(viewModel.level).toBe(1);
    });

    it("should handle comments without text", () => {
      const comment = new CommentEntity(
        123,
        Date.now() / 1000,
        "testuser",
        undefined,
        [],
        0,
        false,
        false
      );

      const viewModel = CommentPresenter.present(comment);

      expect(viewModel.text).toBeUndefined();
      expect(viewModel.hasContent).toBe(false);
      expect(viewModel.replyCount).toBe(0);
      expect(viewModel.hasReplies).toBe(false);
      expect(viewModel.level).toBe(0);
    });

    it("should handle comments with undefined kids", () => {
      const comment = new CommentEntity(
        123,
        Date.now() / 1000,
        "testuser",
        "Comment text",
        undefined,
        0,
        false,
        false
      );

      const viewModel = CommentPresenter.present(comment);

      expect(viewModel.replyCount).toBe(0);
      expect(viewModel.hasReplies).toBe(false);
    });

    it("should handle deleted comments", () => {
      const comment = new CommentEntity(
        123,
        Date.now() / 1000,
        "testuser",
        "Deleted comment",
        [],
        0,
        true, // deleted
        false
      );

      const viewModel = CommentPresenter.present(comment);

      expect(viewModel.hasContent).toBe(false); // deleted comments should not have content
    });

    it("should handle dead comments", () => {
      const comment = new CommentEntity(
        123,
        Date.now() / 1000,
        "testuser",
        "Dead comment",
        [],
        0,
        false,
        true // dead
      );

      const viewModel = CommentPresenter.present(comment);

      expect(viewModel.hasContent).toBe(false); // dead comments should not have content
    });
  });

  describe("presentMultiple()", () => {
    it("should transform array of CommentEntity to CommentViewModel array", () => {
      const comments = [
        new CommentEntity(
          1,
          Date.now() / 1000,
          "user1",
          "Comment 1",
          [2],
          0,
          false,
          false
        ),
        new CommentEntity(
          2,
          Date.now() / 1000,
          "user2",
          "Comment 2",
          [],
          0,
          false,
          false
        ),
      ];

      const viewModels = CommentPresenter.presentMultiple(comments, 2);

      expect(viewModels).toHaveLength(2);
      expect(viewModels[0].id).toBe(1);
      expect(viewModels[0].author).toBe("user1");
      expect(viewModels[0].level).toBe(2);
      expect(viewModels[1].id).toBe(2);
      expect(viewModels[1].author).toBe("user2");
      expect(viewModels[1].level).toBe(2);
    });

    it("should return empty array for empty input", () => {
      const viewModels = CommentPresenter.presentMultiple([]);

      expect(viewModels).toEqual([]);
    });

    it("should handle single comment array", () => {
      const comments = [
        new CommentEntity(
          1,
          Date.now() / 1000,
          "user1",
          "Single comment",
          [],
          0,
          false,
          false
        ),
      ];

      const viewModels = CommentPresenter.presentMultiple(comments);

      expect(viewModels).toHaveLength(1);
      expect(viewModels[0].id).toBe(1);
      expect(viewModels[0].level).toBe(0);
    });
  });

  describe("presentWithReplies()", () => {
    it("should present comments with their reply placeholders", () => {
      const comments = [
        new CommentEntity(
          1,
          Date.now() / 1000,
          "user1",
          "Parent comment",
          [2, 3],
          0,
          false,
          false
        ),
        new CommentEntity(
          4,
          Date.now() / 1000,
          "user2",
          "Another parent",
          [],
          0,
          false,
          false
        ),
      ];

      const viewModels = CommentPresenter.presentWithReplies(comments);

      expect(viewModels).toHaveLength(4); // 2 comments + 2 reply placeholders
      expect(viewModels[0].id).toBe(1);
      expect(viewModels[0].level).toBe(0);
      expect(viewModels[1].id).toBe(2);
      expect(viewModels[1].author).toBe("Loading...");
      expect(viewModels[1].level).toBe(1);
      expect(viewModels[2].id).toBe(3);
      expect(viewModels[2].author).toBe("Loading...");
      expect(viewModels[2].level).toBe(1);
      expect(viewModels[3].id).toBe(4);
      expect(viewModels[3].level).toBe(0);
    });

    it("should handle comments without replies", () => {
      const comments = [
        new CommentEntity(
          1,
          Date.now() / 1000,
          "user1",
          "Comment without replies",
          [],
          0,
          false,
          false
        ),
      ];

      const viewModels = CommentPresenter.presentWithReplies(comments);

      expect(viewModels).toHaveLength(1);
      expect(viewModels[0].id).toBe(1);
      expect(viewModels[0].level).toBe(0);
    });

    it("should handle comments with undefined kids", () => {
      const comments = [
        new CommentEntity(
          1,
          Date.now() / 1000,
          "user1",
          "Comment with undefined kids",
          undefined,
          0,
          false,
          false
        ),
      ];

      const viewModels = CommentPresenter.presentWithReplies(comments);

      expect(viewModels).toHaveLength(1);
      expect(viewModels[0].id).toBe(1);
      expect(viewModels[0].hasReplies).toBe(false);
    });

    it("should handle empty comments array", () => {
      const viewModels = CommentPresenter.presentWithReplies([]);

      expect(viewModels).toEqual([]);
    });

    it("should handle nested levels", () => {
      const comments = [
        new CommentEntity(
          1,
          Date.now() / 1000,
          "user1",
          "Level 0 comment",
          [2],
          0,
          false,
          false
        ),
      ];

      const viewModels = CommentPresenter.presentWithReplies(comments, 5);

      expect(viewModels[0].level).toBe(5);
      expect(viewModels[1].level).toBe(6);
    });
  });
});
