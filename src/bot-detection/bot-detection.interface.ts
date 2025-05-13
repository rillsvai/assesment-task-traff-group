import { Verdict } from './bot-detection.enum';

export interface BotDetectionFilter<T> {
  getScore(payload: T): Promise<number>;
}

export interface VerdictResponseDto {
  verdict: Verdict;
  score: number;
}
