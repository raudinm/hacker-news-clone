export interface Comment {
  id: number;
  by?: string;
  time: number;
  text?: string;
  kids?: number[];
  parent?: number;
  deleted?: boolean;
  dead?: boolean;
}

export class CommentEntity implements Comment {
  constructor(
    public id: number,
    public time: number,
    public by?: string,
    public text?: string,
    public kids?: number[],
    public parent?: number,
    public deleted?: boolean,
    public dead?: boolean
  ) {}

  /**
   * Calculates the time elapsed since the comment was posted
   */
  getTimeAgo(): string {
    const now = Date.now() / 1000;
    const diff = now - this.time;
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    return `${minutes} minutes ago`;
  }

  /**
   * Checks if the comment has valid content
   */
  hasContent(): boolean {
    return (
      !this.deleted &&
      !this.dead &&
      this.text !== undefined &&
      this.text.trim() !== ""
    );
  }

  /**
   * Gets the author name, defaulting to anonymous if not provided
   */
  getAuthor(): string {
    return this.by || "anonymous";
  }

  /**
   * Checks if the comment has replies
   */
  hasReplies(): boolean {
    return (this.kids?.length || 0) > 0;
  }

  /**
   * Gets the number of replies
   */
  getReplyCount(): number {
    return this.kids?.length || 0;
  }
}
