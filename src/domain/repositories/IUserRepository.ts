import { UserEntity } from "../entities";

export interface IUserRepository {
  /**
   * Fetches a user by their ID
   * @param id - The user ID
   * @returns Promise resolving to UserEntity or null if not found
   */
  getUserById(id: string): Promise<UserEntity | null>;

  /**
   * Fetches multiple users by their IDs
   * @param ids - Array of user IDs
   * @returns Promise resolving to array of UserEntity objects
   */
  getUsersByIds(ids: string[]): Promise<UserEntity[]>;

  /**
   * Searches for users by username pattern
   * @param query - Search query
   * @param limit - Maximum number of results
   * @returns Promise resolving to array of UserEntity objects
   */
  searchUsers(query: string, limit?: number): Promise<UserEntity[]>;
}
