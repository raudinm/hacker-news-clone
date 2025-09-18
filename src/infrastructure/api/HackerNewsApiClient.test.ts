import { HackerNewsApiClient } from "./HackerNewsApiClient";

describe("HackerNewsApiClient", () => {
  let client: HackerNewsApiClient;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    client = new HackerNewsApiClient();
    mockFetch.mockClear();
  });

  describe("getTopStoryIds()", () => {
    it("should fetch top story IDs successfully", async () => {
      const mockIds = [1, 2, 3, 4, 5];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIds),
      } as any);

      const result = await client.getTopStoryIds();

      expect(result).toEqual(mockIds);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://hacker-news.firebaseio.com/v0/topstories.json"
      );
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as any);

      await expect(client.getTopStoryIds()).rejects.toThrow(
        "Hacker News API error: 500 Internal Server Error"
      );
    });
  });

  describe("getItem()", () => {
    it("should fetch item by ID", async () => {
      const mockItem = { id: 123, title: "Test Story" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockItem),
      } as any);

      const result = await client.getItem(123);

      expect(result).toEqual(mockItem);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://hacker-news.firebaseio.com/v0/item/123.json"
      );
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(client.getItem(123)).rejects.toThrow("Network error");
    });
  });

  describe("getItems()", () => {
    it("should fetch multiple items by IDs", async () => {
      const mockItems = [
        { id: 1, title: "Story 1" },
        { id: 2, title: "Story 2" },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockItems[0]),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockItems[1]),
        } as any);

      const result = await client.getItems([1, 2]);

      expect(result).toEqual(mockItems);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("getUser()", () => {
    it("should fetch user data", async () => {
      const mockUser = { id: "testuser", karma: 100 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser),
      } as any);

      const result = await client.getUser("testuser");

      expect(result).toEqual(mockUser);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://hacker-news.firebaseio.com/v0/user/testuser.json"
      );
    });
  });

  describe("getUsers()", () => {
    it("should fetch multiple users by IDs", async () => {
      const mockUsers = [
        { id: "user1", karma: 100 },
        { id: "user2", karma: 200 },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockUsers[0]),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockUsers[1]),
        } as any);

      const result = await client.getUsers(["user1", "user2"]);

      expect(result).toEqual(mockUsers);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://hacker-news.firebaseio.com/v0/user/user1.json"
      );
      expect(mockFetch).toHaveBeenCalledWith(
        "https://hacker-news.firebaseio.com/v0/user/user2.json"
      );
    });

    it("should handle empty user IDs array", async () => {
      const result = await client.getUsers([]);

      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("getNewStoryIds()", () => {
    it("should fetch new story IDs successfully", async () => {
      const mockIds = [10, 20, 30];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIds),
      } as any);

      const result = await client.getNewStoryIds();

      expect(result).toEqual(mockIds);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://hacker-news.firebaseio.com/v0/newstories.json"
      );
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as any);

      await expect(client.getNewStoryIds()).rejects.toThrow(
        "Hacker News API error: 404 Not Found"
      );
    });
  });

  describe("getAskStoryIds()", () => {
    it("should fetch ask story IDs successfully", async () => {
      const mockIds = [100, 200, 300];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIds),
      } as any);

      const result = await client.getAskStoryIds();

      expect(result).toEqual(mockIds);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://hacker-news.firebaseio.com/v0/askstories.json"
      );
    });
  });

  describe("getShowStoryIds()", () => {
    it("should fetch show story IDs successfully", async () => {
      const mockIds = [1000, 2000, 3000];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIds),
      } as any);

      const result = await client.getShowStoryIds();

      expect(result).toEqual(mockIds);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://hacker-news.firebaseio.com/v0/showstories.json"
      );
    });
  });

  describe("getJobStoryIds()", () => {
    it("should fetch job story IDs successfully", async () => {
      const mockIds = [10000, 20000, 30000];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIds),
      } as any);

      const result = await client.getJobStoryIds();

      expect(result).toEqual(mockIds);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://hacker-news.firebaseio.com/v0/jobstories.json"
      );
    });
  });
});
