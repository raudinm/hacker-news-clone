import { renderHook, waitFor } from "@testing-library/react";
import { useTopStories, fetchTopStories } from "./useStories";
import { StoryEntity } from "../../domain/entities";

// Mock SWR
jest.mock("swr");
// Mock StoryController directly
jest.mock("../controllers/StoryController", () => ({
  StoryController: jest.fn(),
}));

describe("useTopStories", () => {
  it("should return stories from SWR cache", async () => {
    const mockStories = [
      { id: 1, title: "Test Story", score: 42, author: "user" },
    ];

    // Mock SWR response
    const mockUseSWR = jest.fn(() => ({
      data: mockStories,
      error: undefined,
      isLoading: false,
    }));
    require("swr").default = mockUseSWR;

    const { result } = renderHook(() => useTopStories(5));

    expect(result.current.stories).toEqual(mockStories);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("should handle loading state", () => {
    const mockUseSWR = jest.fn(() => ({
      data: undefined,
      error: undefined,
      isLoading: true,
    }));
    require("swr").default = mockUseSWR;

    const { result } = renderHook(() => useTopStories(5));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.stories).toEqual([]);
  });

  it("should handle error state", () => {
    const errorMessage = "Failed to fetch";
    const mockUseSWR = jest.fn(() => ({
      data: undefined,
      error: new Error(errorMessage),
      isLoading: false,
    }));
    require("swr").default = mockUseSWR;

    const { result } = renderHook(() => useTopStories(5));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(result.current.stories).toEqual([]);
  });

  it("should pass correct parameters to SWR", () => {
    const mockUseSWR = jest.fn(() => ({
      data: [],
      error: undefined,
      isLoading: false,
    }));
    require("swr").default = mockUseSWR;

    renderHook(() => useTopStories(10));

    expect(mockUseSWR).toHaveBeenCalledWith(
      ["top-stories", 10],
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        refreshInterval: 300000,
      })
    );
  });

  it("should handle controller error in fetchTopStories", async () => {
    const mockController = {
      getTopStories: jest.fn().mockResolvedValue({
        success: false,
        error: "Controller error",
        data: [],
      }),
    };

    // Mock the StoryController constructor
    const MockStoryController = jest.fn(() => mockController);
    require("../controllers/StoryController").StoryController =
      MockStoryController;

    const mockUseSWR = jest.fn(() => ({
      data: undefined,
      error: new Error("Controller error"),
      isLoading: false,
    }));
    require("swr").default = mockUseSWR;

    const { result } = renderHook(() => useTopStories(5));

    // Wait for the error to be set
    await waitFor(() => {
      expect(result.current.error?.message).toBe("Controller error");
    });
  });

  it("should handle null data from controller", async () => {
    const mockController = {
      getTopStories: jest.fn().mockResolvedValue({
        success: true,
        error: undefined,
        data: null,
      }),
    };

    // Mock the StoryController constructor
    const MockStoryController = jest.fn(() => mockController);
    require("../controllers/StoryController").StoryController =
      MockStoryController;

    const mockUseSWR = jest.fn(() => ({
      data: undefined,
      error: new Error("Failed to fetch stories"),
      isLoading: false,
    }));
    require("swr").default = mockUseSWR;

    const { result } = renderHook(() => useTopStories(5));

    // Wait for the error to be set
    await waitFor(() => {
      expect(result.current.error?.message).toBe("Failed to fetch stories");
    });
  });

  describe("fetchTopStories", () => {
    it("should return stories when controller succeeds", async () => {
      const mockStories = [
        new StoryEntity(1, "Test Story", 42, "user", Date.now() / 1000),
      ];

      const mockController = {
        getTopStories: jest.fn().mockResolvedValue({
          success: true,
          data: mockStories,
        }),
      };

      const result = await fetchTopStories(5, mockController as any);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].title).toBe("Test Story");
      expect(mockController.getTopStories).toHaveBeenCalledWith(5);
    });

    it("should throw error when controller returns unsuccessful result", async () => {
      const mockController = {
        getTopStories: jest.fn().mockResolvedValue({
          success: false,
          error: "Controller error",
          data: [],
        }),
      };

      const MockStoryController = jest.fn(() => mockController);
      require("../controllers/StoryController").StoryController =
        MockStoryController;

      await expect(fetchTopStories(5, mockController as any)).rejects.toThrow(
        "Controller error"
      );
    });

    it("should throw error when controller returns null data", async () => {
      const mockController = {
        getTopStories: jest.fn().mockResolvedValue({
          success: true,
          error: undefined,
          data: null,
        }),
      };

      const MockStoryController = jest.fn(() => mockController);
      require("../controllers/StoryController").StoryController =
        MockStoryController;

      await expect(fetchTopStories(5, mockController as any)).rejects.toThrow(
        "Failed to fetch stories"
      );
    });
  });
});
