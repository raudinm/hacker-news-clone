export interface User {
  id: string;
  delay?: number;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}

export class UserEntity implements User {
  constructor(
    public id: string,
    public created: number,
    public karma: number,
    public delay?: number,
    public about?: string,
    public submitted?: number[]
  ) {}

  /**
   * Calculates the account age in days
   */
  getAccountAge(): number {
    const now = Date.now() / 1000;
    return Math.max(0, Math.floor((now - this.created) / 86400));
  }

  /**
   * Gets the account creation date formatted
   */
  getCreatedDate(): string {
    return new Date(this.created * 1000).toLocaleDateString();
  }

  /**
   * Checks if the user has submitted any items
   */
  hasSubmissions(): boolean {
    return (this.submitted?.length || 0) > 0;
  }

  /**
   * Gets the number of submissions
   */
  getSubmissionCount(): number {
    return this.submitted?.length || 0;
  }

  /**
   * Checks if the user has an about section
   */
  hasAbout(): boolean {
    return (
      this.about !== undefined &&
      this.about !== null &&
      this.about.trim() !== ""
    );
  }
}
