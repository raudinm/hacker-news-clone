import { FetchCommentsUseCase } from "../../domain/usecases";
import { ICommentRepository } from "../../domain/repositories";
import { HackerNewsCommentRepository } from "../../infrastructure/repositories";

export class CommentController {
  private readonly fetchCommentsUseCase: FetchCommentsUseCase;

  constructor(
    commentRepository: ICommentRepository = new HackerNewsCommentRepository()
  ) {
    this.fetchCommentsUseCase = new FetchCommentsUseCase(commentRepository);
  }

  /**
   * Fetches comments by their IDs
   */
  async getComments(commentIds: number[]) {
    try {
      const result = await this.fetchCommentsUseCase.execute({ commentIds });
      return {
        success: true,
        data: result.comments,
      };
    } catch (error) {
      console.error("Error in CommentController.getComments:", error);
      return {
        success: false,
        error: "Failed to fetch story comments",
        data: [],
      };
    }
  }

  /**
   * Fetches comments for a specific story
   */
  async getCommentsForStory(storyId: number) {
    try {
      // First get the story to obtain comment IDs
      const storyController = new (
        await import("./StoryController")
      ).StoryController();
      const storyResult = await storyController.getStoryDetails(storyId);

      if (!storyResult.success || !storyResult.data) {
        return {
          success: false,
          error: "Story not found",
          data: [],
        };
      }

      const commentIds = storyResult.data.kids || [];
      return this.getComments(commentIds);
    } catch (error) {
      console.error("Error in CommentController.getCommentsForStory:", error);
      return {
        success: false,
        error: "Failed to fetch comments",
        data: [],
      };
    }
  }
}
