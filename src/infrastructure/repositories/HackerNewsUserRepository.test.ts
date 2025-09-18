import { HackerNewsUserRepository } from "./HackerNewsUserRepository";
import { HackerNewsApiClient } from "../api/HackerNewsApiClient";
import { UserEntity } from "../../domain/entities";

// Mock the API client
jest.mock("../api/HackerNewsApiClient");

describe("HackerNewsUserRepository", () => {
  let repository: HackerNewsUserRepository;
  let mockApiClient: jest.Mocked<HackerNewsApiClient>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockApiClient =
      new HackerNewsApiClient() as jest.Mocked<HackerNewsApiClient>;
    repository = new HackerNewsUserRepository(mockApiClient);
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("getUserById", () => {
    it("should return null for non-existent user", async () => {
      mockApiClient.getUser.mockResolvedValue(null);

      const result = await repository.getUserById("nonexistent");

      expect(mockApiClient.getUser).toHaveBeenCalledWith("nonexistent");
      expect(result).toBeNull();
    });

    it("should return UserEntity for valid user", async () => {
      const mockUser = {
        id: "testuser",
        created: 1234567890,
        karma: 100,
        delay: 0,
        about: "Test user bio",
        submitted: [1, 2, 3],
      };

      mockApiClient.getUser.mockResolvedValue(mockUser);

      const result = await repository.getUserById("testuser");

      expect(mockApiClient.getUser).toHaveBeenCalledWith("testuser");
      expect(result).toBeInstanceOf(UserEntity);
      expect(result?.id).toBe("testuser");
      expect(result?.karma).toBe(100);
      expect(result?.about).toBe("Test user bio");
      expect(result?.submitted).toEqual([1, 2, 3]);
    });

    it("should handle API errors gracefully", async () => {
      mockApiClient.getUser.mockRejectedValue(new Error("API Error"));

      const result = await repository.getUserById("testuser");

      expect(result).toBeNull();
    });
  });

  describe("getUsersByIds", () => {
    it("should return empty array for empty ids", async () => {
      const result = await repository.getUsersByIds([]);
      expect(result).toEqual([]);
      expect(mockApiClient.getUsers).not.toHaveBeenCalled();
    });

    it("should return empty array for null ids", async () => {
      const result = await repository.getUsersByIds(null as any);
      expect(result).toEqual([]);
      expect(mockApiClient.getUsers).not.toHaveBeenCalled();
    });

    it("should fetch and filter users successfully", async () => {
      const mockUsers = [
        {
          id: "user1",
          created: 1234567890,
          karma: 100,
          delay: 0,
          about: "User 1 bio",
          submitted: [1, 2],
        },
        {
          id: "user2",
          created: 1234567891,
          karma: 200,
          delay: 1,
          about: "User 2 bio",
          submitted: [3, 4],
        },
        null, // Simulate missing user
      ];

      mockApiClient.getUsers.mockResolvedValue(mockUsers);

      const result = await repository.getUsersByIds([
        "user1",
        "user2",
        "user3",
      ]);

      expect(mockApiClient.getUsers).toHaveBeenCalledWith([
        "user1",
        "user2",
        "user3",
      ]);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(UserEntity);
      expect(result[0].id).toBe("user1");
      expect(result[0].karma).toBe(100);
      expect(result[1].id).toBe("user2");
      expect(result[1].karma).toBe(200);
    });

    it("should handle API errors gracefully", async () => {
      mockApiClient.getUsers.mockRejectedValue(new Error("API Error"));

      const result = await repository.getUsersByIds(["user1", "user2"]);

      expect(result).toEqual([]);
    });
  });

  describe("searchUsers", () => {
    it("should return empty array and log warning", async () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

      const result = await repository.searchUsers("test query", 5);

      expect(result).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "User search not implemented in Hacker News API"
      );

      consoleWarnSpy.mockRestore();
    });

    it("should use default limit when not provided", async () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

      const result = await repository.searchUsers("test query");

      expect(result).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "User search not implemented in Hacker News API"
      );

      consoleWarnSpy.mockRestore();
    });

    it("should handle empty query", async () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

      const result = await repository.searchUsers("", 10);

      expect(result).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "User search not implemented in Hacker News API"
      );

      consoleWarnSpy.mockRestore();
    });
  });
});
