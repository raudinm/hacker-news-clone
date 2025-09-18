/**
 * External API client for Hacker News Firebase API
 * This is the interface adapter that connects to the external API
 */
export class HackerNewsApiClient {
  private readonly baseUrl = "https://hacker-news.firebaseio.com/v0";

  /**
   * Fetches data from Hacker News API
   */
  private async fetchData<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}.json`);
    if (!response.ok) {
      throw new Error(
        `Hacker News API error: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  }

  /**
   * Fetches top story IDs
   */
  async getTopStoryIds(): Promise<number[]> {
    return this.fetchData<number[]>("/topstories");
  }

  /**
   * Fetches new story IDs
   */
  async getNewStoryIds(): Promise<number[]> {
    return this.fetchData<number[]>("/newstories");
  }

  /**
   * Fetches ask story IDs
   */
  async getAskStoryIds(): Promise<number[]> {
    return this.fetchData<number[]>("/askstories");
  }

  /**
   * Fetches show story IDs
   */
  async getShowStoryIds(): Promise<number[]> {
    return this.fetchData<number[]>("/showstories");
  }

  /**
   * Fetches job story IDs
   */
  async getJobStoryIds(): Promise<number[]> {
    return this.fetchData<number[]>("/jobstories");
  }

  /**
   * Fetches an item (story, comment, etc.) by ID
   */
  async getItem<T = any>(id: number): Promise<T> {
    return this.fetchData<T>(`/item/${id}`);
  }

  /**
   * Fetches multiple items by their IDs
   */
  async getItems<T = any>(ids: number[]): Promise<T[]> {
    const promises = ids.map((id) => this.getItem<T>(id));
    return Promise.all(promises);
  }

  /**
   * Fetches user data by ID
   */
  async getUser(id: string): Promise<any> {
    return this.fetchData(`/user/${id}`);
  }

  /**
   * Fetches multiple users by their IDs
   */
  async getUsers(ids: string[]): Promise<any[]> {
    const promises = ids.map((id) => this.getUser(id));
    return Promise.all(promises);
  }
}
