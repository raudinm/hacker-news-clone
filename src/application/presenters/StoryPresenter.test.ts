import { StoryPresenter } from "./StoryPresenter";
import { StoryEntity } from "../../domain/entities";

describe("StoryPresenter", () => {
  describe("present()", () => {
    it("should transform StoryEntity to StoryViewModel", () => {
      const story = new StoryEntity(
        123,
        "Test Story",
        42,
        "testuser",
        Date.now() / 1000 - 3600,
        "https://example.com",
        5
      );

      const viewModel = StoryPresenter.present(story);

      expect(viewModel.id).toBe(123);
      expect(viewModel.title).toBe("Test Story");
      expect(viewModel.score).toBe(42);
      expect(viewModel.author).toBe("testuser");
      expect(viewModel.hasExternalUrl).toBe(true);
      expect(viewModel.commentCount).toBe(5);
      expect(viewModel.displayUrl).toBe("https://example.com");
    });

    it("should handle stories without URLs", () => {
      const story = new StoryEntity(
        123,
        "Test Story",
        42,
        "testuser",
        Date.now() / 1000
      );

      const viewModel = StoryPresenter.present(story);

      expect(viewModel.hasExternalUrl).toBe(false);
      expect(viewModel.displayUrl).toBe("/item/123");
    });

    it("should handle stories without descendants", () => {
      const story = new StoryEntity(
        123,
        "Test Story",
        42,
        "testuser",
        Date.now() / 1000
      );

      const viewModel = StoryPresenter.present(story);

      expect(viewModel.commentCount).toBe(0);
    });
  });

  describe("presentMultiple()", () => {
    it("should transform array of StoryEntity to StoryViewModel array", () => {
      const stories = [
        new StoryEntity(1, "Story 1", 42, "user1", Date.now() / 1000),
        new StoryEntity(2, "Story 2", 25, "user2", Date.now() / 1000),
      ];

      const viewModels = StoryPresenter.presentMultiple(stories);

      expect(viewModels).toHaveLength(2);
      expect(viewModels[0].id).toBe(1);
      expect(viewModels[0].title).toBe("Story 1");
      expect(viewModels[1].id).toBe(2);
      expect(viewModels[1].title).toBe("Story 2");
    });

    it("should return empty array for empty input", () => {
      const viewModels = StoryPresenter.presentMultiple([]);

      expect(viewModels).toEqual([]);
    });
  });
});
