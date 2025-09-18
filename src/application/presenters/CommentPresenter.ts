import { CommentEntity } from "../../domain/entities";

export interface CommentViewModel {
  id: number;
  author: string;
  timeAgo: string;
  text?: string;
  hasContent: boolean;
  replyCount: number;
  hasReplies: boolean;
  level?: number;
}

export class CommentPresenter {
  /**
   * Transforms a CommentEntity into a CommentViewModel for UI consumption
   */
  static present(comment: CommentEntity, level: number = 0): CommentViewModel {
    return {
      id: comment.id,
      author: comment.getAuthor(),
      timeAgo: comment.getTimeAgo(),
      text: comment.text,
      hasContent: comment.hasContent(),
      replyCount: comment.getReplyCount(),
      hasReplies: comment.hasReplies(),
      level,
    };
  }

  /**
   * Transforms multiple CommentEntities into CommentViewModels
   */
  static presentMultiple(
    comments: CommentEntity[],
    level: number = 0
  ): CommentViewModel[] {
    return comments.map((comment) => this.present(comment, level));
  }

  /**
   * Recursively presents comments with their nested replies
   * This creates a flat list with level information for rendering
   */
  static presentWithReplies(
    comments: CommentEntity[],
    level: number = 0
  ): CommentViewModel[] {
    const result: CommentViewModel[] = [];

    for (const comment of comments) {
      // Add the comment itself
      result.push(this.present(comment, level));

      // If the comment has replies, recursively add them
      if (comment.hasReplies() && comment.kids) {
        // Note: In a real implementation, you'd fetch the actual reply comments
        // For now, this is a placeholder structure
        const replyPlaceholders = comment.kids.map((kidId) => ({
          id: kidId,
          author: "Loading...",
          timeAgo: "",
          text: "Loading reply...",
          hasContent: true,
          replyCount: 0,
          hasReplies: false,
          level: level + 1,
        }));
        result.push(...replyPlaceholders);
      }
    }

    return result;
  }
}
