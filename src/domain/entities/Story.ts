export interface Story {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  text?: string;
  kids?: number[];
}

export class StoryEntity implements Story {
  constructor(
    public id: number,
    public title: string,
    public score: number,
    public by: string,
    public time: number,
    public url?: string,
    public descendants?: number,
    public text?: string,
    public kids?: number[]
  ) {}

  /**
   * Calculates the time elapsed since the story was posted
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
   * Checks if the story has an external URL
   */
  hasExternalUrl(): boolean {
    return this.url !== undefined;
  }

  /**
   * Gets the display URL for the story
   */
  getDisplayUrl(): string {
    return this.url || `/item/${this.id}`;
  }

  /**
   * Checks if the story has comments
   */
  hasComments(): boolean {
    return (this.descendants || 0) > 0;
  }
}
