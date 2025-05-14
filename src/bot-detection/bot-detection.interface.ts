export interface BotDetectionFilter<T> {
  getScore(payload: T): Promise<number>;
}
