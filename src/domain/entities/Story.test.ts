import { StoryEntity } from "./Story";

describe("StoryEntity", () => {
  const mockStoryData = {
    id: 123,
    title: "Test Story",
    score: 42,
    by: "testuser",
    time: Date.now() / 1000 - 3600, // 1 hour ago
    url: "https://example.com",
    descendants: 5,
    text: "Test content",
    kids: [456, 789],
  };

  let story: StoryEntity;

  beforeEach(() => {
    story = new StoryEntity(
      mockStoryData.id,
      mockStoryData.title,
      mockStoryData.score,
      mockStoryData.by,
      mockStoryData.time,
      mockStoryData.url,
      mockStoryData.descendants,
      mockStoryData.text,
      mockStoryData.kids
    );
  });

  describe("getTimeAgo()", () => {
    it("should return minutes ago for recent stories", () => {
      const recentTime = Date.now() / 1000 - 300; // 5 minutes ago
      const recentStory = new StoryEntity(1, "Recent", 10, "user", recentTime);
      expect(recentStory.getTimeAgo()).toBe("5 minutes ago");
    });

    it("should return hours ago for older stories", () => {
      expect(story.getTimeAgo()).toBe("1 hours ago");
    });

    it("should return days ago for very old stories", () => {
      const oldTime = Date.now() / 1000 - 86400 * 3; // 3 days ago
      const oldStory = new StoryEntity(1, "Old", 10, "user", oldTime);
      expect(oldStory.getTimeAgo()).toBe("3 days ago");
    });
  });

  describe("hasExternalUrl()", () => {
    it("should return true when URL is present", () => {
      expect(story.hasExternalUrl()).toBe(true);
    });

    it("should return false when URL is undefined", () => {
      const storyWithoutUrl = new StoryEntity(
        1,
        "No URL",
        10,
        "user",
        Date.now() / 1000
      );
      expect(storyWithoutUrl.hasExternalUrl()).toBe(false);
    });
  });

  describe("getDisplayUrl()", () => {
    it("should return external URL when present", () => {
      expect(story.getDisplayUrl()).toBe("https://example.com");
    });

    it("should return internal URL when no external URL", () => {
      const storyWithoutUrl = new StoryEntity(
        1,
        "No URL",
        10,
        "user",
        Date.now() / 1000
      );
      expect(storyWithoutUrl.getDisplayUrl()).toBe("/item/1");
    });
  });

  describe("hasComments()", () => {
    it("should return true when descendants > 0", () => {
      expect(story.hasComments()).toBe(true);
    });

    it("should return false when descendants is 0 or undefined", () => {
      const storyWithoutComments = new StoryEntity(
        1,
        "No Comments",
        10,
        "user",
        Date.now() / 1000
      );
      expect(storyWithoutComments.hasComments()).toBe(false);
    });
  });
});
