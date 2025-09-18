import { renderHook, waitFor } from "@testing-library/react";
import {
  useStoryDetails,
  fetchStoryDetails,
  fetchCommentsForStory,
} from "./useStoryDetails";
import { StoryEntity, CommentEntity } from "../../domain/entities";

// Mock SWR
jest.mock("swr");
// Mock controllers
jest.mock("../controllers/StoryController", () => ({
  StoryController: jest.fn(),
}));
jest.mock("../controllers/CommentController", () => ({
  CommentController: jest.fn(),
}));

describe("useStoryDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return story and comments for valid storyId", async () => {
    const mockStory = { id: 123, title: "Test Story", author: "user" };
    const mockComments = [
      { id: 1, author: "commenter1", text: "Comment 1" },
      { id: 2, author: "commenter2", text: "Comment 2" },
    ];

    // Mock SWR for story
    const mockUseSWR = jest.fn();
    mockUseSWR
      .mockReturnValueOnce({
        data: mockStory,
        error: undefined,
        isLoading: false,
      })
      .mockReturnValueOnce({
        data: mockComments,
        error: undefined,
        isLoading: false,
      });
    require("swr").default = mockUseSWR;

    const { result } = renderHook(() => useStoryDetails(123));

    expect(result.current.story).toEqual(mockStory);
    expect(result.current.comments).toEqual(mockComments);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("should handle loading states", () => {
    const mockUseSWR = jest.fn();
    mockUseSWR
      .mockReturnValueOnce({
        data: undefined,
        error: undefined,
        isLoading: true,
      })
      .mockReturnValueOnce({
        data: undefined,
        error: undefined,
        isLoading: false,
      });
    require("swr").default = mockUseSWR;

    const { result } = renderHook(() => useStoryDetails(123));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.story).toBeUndefined();
    expect(result.current.comments).toEqual([]);
  });

  it("should handle story error", async () => {
    const storyError = new Error("Story not found");

    const mockUseSWR = jest.fn();
    mockUseSWR
      .mockReturnValueOnce({
        data: undefined,
        error: storyError,
        isLoading: false,
      })
      .mockReturnValueOnce({
        data: [],
        error: undefined,
        isLoading: false,
      });
    require("swr").default = mockUseSWR;

    const { result } = renderHook(() => useStoryDetails(123));

    await waitFor(() => {
      expect(result.current.error).toBe(storyError);
    });
    expect(result.current.story).toBeUndefined();
  });

  it("should handle comments error", async () => {
    const commentsError = new Error("Comments failed");

    const mockUseSWR = jest.fn();
    mockUseSWR
      .mockReturnValueOnce({
        data: { id: 123, title: "Test Story" },
        error: undefined,
        isLoading: false,
      })
      .mockReturnValueOnce({
        data: undefined,
        error: commentsError,
        isLoading: false,
      });
    require("swr").default = mockUseSWR;

    const { result } = renderHook(() => useStoryDetails(123));

    await waitFor(() => {
      expect(result.current.error).toBe(commentsError);
    });
    expect(result.current.comments).toEqual([]);
  });

  it("should return empty data when storyId is null", () => {
    const mockUseSWR = jest.fn(() => ({
      data: undefined,
      error: undefined,
      isLoading: false,
    }));
    require("swr").default = mockUseSWR;

    const { result } = renderHook(() => useStoryDetails(null));

    expect(result.current.story).toBeUndefined();
    expect(result.current.comments).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("should pass correct keys to SWR", () => {
    const mockUseSWR = jest.fn();
    mockUseSWR
      .mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
      })
      .mockReturnValue({
        data: [],
        error: undefined,
        isLoading: false,
      });
    require("swr").default = mockUseSWR;

    renderHook(() => useStoryDetails(456));

    expect(mockUseSWR).toHaveBeenCalledWith(
      ["story-details", 456],
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      })
    );

    expect(mockUseSWR).toHaveBeenCalledWith(
      ["story-comments", 456],
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      })
    );
  });

  it("should pass null keys to SWR when storyId is null", () => {
    const mockUseSWR = jest.fn(() => ({
      data: undefined,
      error: undefined,
      isLoading: false,
    }));
    require("swr").default = mockUseSWR;

    renderHook(() => useStoryDetails(null));

    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Object)
    );
    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should return mutate functions", () => {
    const mockMutateStory = jest.fn();
    const mockMutateComments = jest.fn();

    const mockUseSWR = jest.fn();
    mockUseSWR
      .mockReturnValueOnce({
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: mockMutateStory,
      })
      .mockReturnValueOnce({
        data: [],
        error: undefined,
        isLoading: false,
        mutate: mockMutateComments,
      });
    require("swr").default = mockUseSWR;

    const { result } = renderHook(() => useStoryDetails(123));

    expect(result.current.mutateStory).toBe(mockMutateStory);
    expect(result.current.mutateComments).toBe(mockMutateComments);
  });

  describe("fetchStoryDetails", () => {
    it("should return story when controller succeeds", async () => {
      const mockStory = new StoryEntity(
        123,
        "Test Story",
        42,
        "user",
        Date.now() / 1000
      );

      const mockController = {
        getStoryDetails: jest.fn().mockResolvedValue({
          success: true,
          data: mockStory,
        }),
      };

      const result = await fetchStoryDetails(123, mockController as any);

      expect(result).toBeDefined();
      expect(result?.id).toBe(123);
      expect(result?.title).toBe("Test Story");
      expect(mockController.getStoryDetails).toHaveBeenCalledWith(123);
    });

    it("should throw error when controller returns unsuccessful result", async () => {
      const mockController = {
        getStoryDetails: jest.fn().mockResolvedValue({
          success: false,
          error: "Story not found",
          data: null,
        }),
      };

      const MockStoryController = jest.fn(() => mockController);
      require("../controllers/StoryController").StoryController =
        MockStoryController;

      await expect(
        fetchStoryDetails(123, mockController as any)
      ).rejects.toThrow("Story not found");
    });

    it("should throw error when controller returns null data", async () => {
      const mockController = {
        getStoryDetails: jest.fn().mockResolvedValue({
          success: true,
          error: undefined,
          data: null,
        }),
      };

      const MockStoryController = jest.fn(() => mockController);
      require("../controllers/StoryController").StoryController =
        MockStoryController;

      await expect(
        fetchStoryDetails(123, mockController as any)
      ).rejects.toThrow("Story not found");
    });
  });

  describe("fetchCommentsForStory", () => {
    it("should return comments when controller succeeds", async () => {
      const mockComments = [
        new CommentEntity(
          1,
          Date.now() / 1000,
          "commenter1",
          "Comment 1",
          [],
          0,
          false,
          false
        ),
        new CommentEntity(
          2,
          Date.now() / 1000,
          "commenter2",
          "Comment 2",
          [],
          0,
          false,
          false
        ),
      ];

      const mockController = {
        getCommentsForStory: jest.fn().mockResolvedValue({
          success: true,
          data: mockComments,
        }),
      };

      const result = await fetchCommentsForStory(123, mockController as any);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].author).toBe("commenter1");
      expect(mockController.getCommentsForStory).toHaveBeenCalledWith(123);
    });

    it("should return empty array when controller returns unsuccessful result", async () => {
      const mockController = {
        getCommentsForStory: jest.fn().mockResolvedValue({
          success: false,
          error: "Comments not found",
          data: [],
        }),
      };

      const MockCommentController = jest.fn(() => mockController);
      require("../controllers/CommentController").CommentController =
        MockCommentController;

      const result = await fetchCommentsForStory(123, mockController as any);

      expect(result).toEqual([]);
    });

    it("should return empty array when controller returns null data", async () => {
      const mockController = {
        getCommentsForStory: jest.fn().mockResolvedValue({
          success: true,
          error: undefined,
          data: null,
        }),
      };

      const MockCommentController = jest.fn(() => mockController);
      require("../controllers/CommentController").CommentController =
        MockCommentController;

      const result = await fetchCommentsForStory(123, mockController as any);

      expect(result).toEqual([]);
    });
  });
});
