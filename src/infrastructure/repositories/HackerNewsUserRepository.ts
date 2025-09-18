import { UserEntity } from "../../domain/entities";
import { IUserRepository } from "../../domain/repositories";
import { HackerNewsApiClient } from "../api/HackerNewsApiClient";

export class HackerNewsUserRepository implements IUserRepository {
  constructor(
    private readonly apiClient: HackerNewsApiClient = new HackerNewsApiClient()
  ) {}

  async getUserById(id: string): Promise<UserEntity | null> {
    try {
      const user = await this.apiClient.getUser(id);

      if (!user) {
        return null;
      }

      return new UserEntity(
        user.id,
        user.created,
        user.karma,
        user.delay,
        user.about,
        user.submitted
      );
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      return null;
    }
  }

  async getUsersByIds(ids: string[]): Promise<UserEntity[]> {
    try {
      if (!ids || ids.length === 0) {
        return [];
      }

      const users = await this.apiClient.getUsers(ids);

      return users
        .filter((user) => user)
        .map(
          (user) =>
            new UserEntity(
              user.id,
              user.created,
              user.karma,
              user.delay,
              user.about,
              user.submitted
            )
        );
    } catch (error) {
      console.error("Error fetching users by IDs:", error);
      return [];
    }
  }

  async searchUsers(query: string, limit: number = 10): Promise<UserEntity[]> {
    // Hacker News API doesn't provide user search functionality
    // This is a placeholder implementation that could be extended
    // with a different search service or local caching
    console.warn("User search not implemented in Hacker News API");
    return [];
  }
}
