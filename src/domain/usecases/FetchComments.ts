import { CommentEntity } from "../entities";

export interface FetchCommentsInput {
  commentIds: number[];
}

export interface FetchCommentsOutput {
  comments: CommentEntity[];
}

export interface IFetchCommentsUseCase {
  execute(input: FetchCommentsInput): Promise<FetchCommentsOutput>;
}

export class FetchCommentsUseCase implements IFetchCommentsUseCase {
  constructor(private readonly commentRepository: ICommentRepository) {}

  async execute(input: FetchCommentsInput): Promise<FetchCommentsOutput> {
    if (
      !input.commentIds ||
      !Array.isArray(input.commentIds) ||
      input.commentIds.length === 0
    ) {
      return { comments: [] };
    }

    const comments = await this.commentRepository.getCommentsByIds(
      input.commentIds
    );

    if (!comments || !Array.isArray(comments)) {
      return { comments: [] };
    }

    return {
      comments: comments.map(
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
      ),
    };
  }
}

// Repository interface for comments
export interface ICommentRepository {
  getCommentsByIds(ids: number[]): Promise<CommentEntity[]>;
  getCommentById(id: number): Promise<CommentEntity | null>;
}
