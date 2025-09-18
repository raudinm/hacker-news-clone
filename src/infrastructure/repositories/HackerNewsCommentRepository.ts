import { CommentEntity } from "../../domain/entities";
import { ICommentRepository } from "../../domain/repositories";
import { HackerNewsApiClient } from "../api/HackerNewsApiClient";

export class HackerNewsCommentRepository implements ICommentRepository {
  constructor(
    private readonly apiClient: HackerNewsApiClient = new HackerNewsApiClient()
  ) {}

  async getCommentsByIds(ids: number[]): Promise<CommentEntity[]> {
    try {
      if (!ids || ids.length === 0) {
        return [];
      }

      const comments = await this.apiClient.getItems(ids);

      return comments
        .filter(
          (comment) =>
            comment &&
            !comment.deleted &&
            !comment.dead &&
            comment.type === "comment"
        )
        .map(
          (comment) =>
            new CommentEntity(
              comment.id,
              comment.time,
              comment.by,
              comment.text,
              comment.kids,
              comment.parent,
              comment.deleted,
              comment.dead
            )
        );
    } catch (error) {
      console.error("Error fetching comments by IDs:", error);
      return [];
    }
  }

  async getCommentById(id: number): Promise<CommentEntity | null> {
    try {
      const comment = await this.apiClient.getItem(id);

      if (
        !comment ||
        comment.deleted ||
        comment.dead ||
        comment.type !== "comment"
      ) {
        return null;
      }

      return new CommentEntity(
        comment.id,
        comment.time,
        comment.by,
        comment.text,
        comment.kids,
        comment.parent,
        comment.deleted,
        comment.dead
      );
    } catch (error) {
      console.error(`Error fetching comment ${id}:`, error);
      return null;
    }
  }

  async getCommentsByStoryId(storyId: number): Promise<CommentEntity[]> {
    try {
      const story = await this.apiClient.getItem(storyId);

      if (!story || !story.kids || story.kids.length === 0) {
        return [];
      }

      return this.getCommentsByIds(story.kids);
    } catch (error) {
      console.error(`Error fetching comments for story ${storyId}:`, error);
      return [];
    }
  }

  async getCommentReplies(commentId: number): Promise<CommentEntity[]> {
    try {
      const comment = await this.apiClient.getItem(commentId);

      if (!comment || !comment.kids || comment.kids.length === 0) {
        return [];
      }

      return this.getCommentsByIds(comment.kids);
    } catch (error) {
      console.error(`Error fetching replies for comment ${commentId}:`, error);
      return [];
    }
  }
}
