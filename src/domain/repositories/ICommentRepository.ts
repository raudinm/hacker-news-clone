import { CommentEntity } from "../entities";

export interface ICommentRepository {
  /**
   * Fetches multiple comments by their IDs
   * @param ids - Array of comment IDs
   * @returns Promise resolving to array of CommentEntity objects
   */
  getCommentsByIds(ids: number[]): Promise<CommentEntity[]>;

  /**
   * Fetches a specific comment by its ID
   * @param id - The comment ID
   * @returns Promise resolving to CommentEntity or null if not found
   */
  getCommentById(id: number): Promise<CommentEntity | null>;

  /**
   * Fetches all comments for a specific story
   * @param storyId - The story ID
   * @returns Promise resolving to array of CommentEntity objects
   */
  getCommentsByStoryId(storyId: number): Promise<CommentEntity[]>;

  /**
   * Fetches replies for a specific comment
   * @param commentId - The parent comment ID
   * @returns Promise resolving to array of CommentEntity objects
   */
  getCommentReplies(commentId: number): Promise<CommentEntity[]>;
}
