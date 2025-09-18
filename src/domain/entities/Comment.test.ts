import { CommentEntity } from "./Comment";

describe("CommentEntity", () => {
  describe("getTimeAgo()", () => {
    it("should return minutes ago for recent comments", () => {
      const recentTime = Date.now() / 1000 - 120; // 2 minutes ago
      const comment = new CommentEntity(1, recentTime, "user", "text");

      expect(comment.getTimeAgo()).toBe("2 minutes ago");
    });

    it("should return hours ago for comments within a day", () => {
      const hoursTime = Date.now() / 1000 - 3600 * 3; // 3 hours ago
      const comment = new CommentEntity(1, hoursTime, "user", "text");

      expect(comment.getTimeAgo()).toBe("3 hours ago");
    });

    it("should return days ago for old comments", () => {
      const oldTime = Date.now() / 1000 - 86400 * 5; // 5 days ago
      const comment = new CommentEntity(1, oldTime, "user", "text");

      expect(comment.getTimeAgo()).toBe("5 days ago");
    });

    it("should handle exactly 1 minute", () => {
      const oneMinuteTime = Date.now() / 1000 - 60;
      const comment = new CommentEntity(1, oneMinuteTime, "user", "text");

      expect(comment.getTimeAgo()).toBe("1 minutes ago");
    });

    it("should handle exactly 1 hour", () => {
      const oneHourTime = Date.now() / 1000 - 3600;
      const comment = new CommentEntity(1, oneHourTime, "user", "text");

      expect(comment.getTimeAgo()).toBe("1 hours ago");
    });

    it("should handle exactly 1 day", () => {
      const oneDayTime = Date.now() / 1000 - 86400;
      const comment = new CommentEntity(1, oneDayTime, "user", "text");

      expect(comment.getTimeAgo()).toBe("1 days ago");
    });
  });

  describe("hasContent()", () => {
    it("should return false for deleted comments", () => {
      const comment = new CommentEntity(
        1,
        Date.now() / 1000,
        "user",
        "text",
        [],
        undefined,
        true
      );

      expect(comment.hasContent()).toBe(false);
    });

    it("should return false for dead comments", () => {
      const comment = new CommentEntity(
        1,
        Date.now() / 1000,
        "user",
        "text",
        [],
        undefined,
        false,
        true
      );

      expect(comment.hasContent()).toBe(false);
    });

    it("should return false for comments without text", () => {
      const comment = new CommentEntity(
        1,
        Date.now() / 1000,
        "user",
        undefined
      );

      expect(comment.hasContent()).toBe(false);
    });

    it("should return false for comments with empty text", () => {
      const comment = new CommentEntity(1, Date.now() / 1000, "user", "");

      expect(comment.hasContent()).toBe(false);
    });

    it("should return false for comments with whitespace-only text", () => {
      const comment = new CommentEntity(1, Date.now() / 1000, "user", "   ");

      expect(comment.hasContent()).toBe(false);
    });

    it("should return true for valid comments", () => {
      const comment = new CommentEntity(
        1,
        Date.now() / 1000,
        "user",
        "valid text"
      );

      expect(comment.hasContent()).toBe(true);
    });

    it("should return true for comments with content despite being deleted", () => {
      // This tests the logic - if it has text and isn't deleted/dead, it should return true
      const comment = new CommentEntity(
        1,
        Date.now() / 1000,
        "user",
        "text",
        [],
        undefined,
        false,
        false
      );

      expect(comment.hasContent()).toBe(true);
    });
  });

  describe("getAuthor()", () => {
    it("should return author name when provided", () => {
      const comment = new CommentEntity(
        1,
        Date.now() / 1000,
        "testuser",
        "text"
      );

      expect(comment.getAuthor()).toBe("testuser");
    });

    it("should return anonymous for undefined author", () => {
      const comment = new CommentEntity(
        1,
        Date.now() / 1000,
        undefined,
        "text"
      );

      expect(comment.getAuthor()).toBe("anonymous");
    });

    it("should return anonymous for null author", () => {
      const comment = new CommentEntity(
        1,
        Date.now() / 1000,
        null as any,
        "text"
      );

      expect(comment.getAuthor()).toBe("anonymous");
    });

    it("should return anonymous for empty string author", () => {
      const comment = new CommentEntity(1, Date.now() / 1000, "", "text");

      expect(comment.getAuthor()).toBe("anonymous");
    });
  });

  describe("hasReplies()", () => {
    it("should return false for comments without kids", () => {
      const comment = new CommentEntity(1, Date.now() / 1000, "user", "text");

      expect(comment.hasReplies()).toBe(false);
    });

    it("should return false for comments with empty kids array", () => {
      const comment = new CommentEntity(
        1,
        Date.now() / 1000,
        "user",
        "text",
        []
      );

      expect(comment.hasReplies()).toBe(false);
    });

    it("should return true for comments with kids", () => {
      const comment = new CommentEntity(
        1,
        Date.now() / 1000,
        "user",
        "text",
        [2, 3]
      );

      expect(comment.hasReplies()).toBe(true);
    });

    it("should return true for comments with one kid", () => {
      const comment = new CommentEntity(1, Date.now() / 1000, "user", "text", [
        2,
      ]);

      expect(comment.hasReplies()).toBe(true);
    });
  });

  describe("getReplyCount()", () => {
    it("should return 0 for comments without kids", () => {
      const comment = new CommentEntity(1, Date.now() / 1000, "user", "text");

      expect(comment.getReplyCount()).toBe(0);
    });

    it("should return 0 for comments with empty kids array", () => {
      const comment = new CommentEntity(
        1,
        Date.now() / 1000,
        "user",
        "text",
        []
      );

      expect(comment.getReplyCount()).toBe(0);
    });

    it("should return correct count for comments with kids", () => {
      const comment = new CommentEntity(
        1,
        Date.now() / 1000,
        "user",
        "text",
        [2, 3, 4]
      );

      expect(comment.getReplyCount()).toBe(3);
    });

    it("should return 1 for comments with one kid", () => {
      const comment = new CommentEntity(1, Date.now() / 1000, "user", "text", [
        2,
      ]);

      expect(comment.getReplyCount()).toBe(1);
    });
  });

  describe("constructor and properties", () => {
    it("should create comment with all properties", () => {
      const time = Date.now() / 1000;
      const comment = new CommentEntity(
        1,
        time,
        "testuser",
        "test text",
        [2, 3],
        0,
        false,
        false
      );

      expect(comment.id).toBe(1);
      expect(comment.time).toBe(time);
      expect(comment.by).toBe("testuser");
      expect(comment.text).toBe("test text");
      expect(comment.kids).toEqual([2, 3]);
      expect(comment.parent).toBe(0);
      expect(comment.deleted).toBe(false);
      expect(comment.dead).toBe(false);
    });

    it("should handle optional properties", () => {
      const comment = new CommentEntity(1, Date.now() / 1000);

      expect(comment.by).toBeUndefined();
      expect(comment.text).toBeUndefined();
      expect(comment.kids).toBeUndefined();
      expect(comment.parent).toBeUndefined();
      expect(comment.deleted).toBeUndefined();
      expect(comment.dead).toBeUndefined();
    });
  });
});
