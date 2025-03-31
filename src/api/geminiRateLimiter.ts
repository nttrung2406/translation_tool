// src/api/geminiRateLimiter.ts
export class RateLimiter {
  private requestsPerMinute: number;
  private requestsPerDay: number;
  private minuteTokens: number;
  private dayTokens: number;
  private lastRefillMinute: number;
  private lastRefillDay: number;

  constructor(rpm: number, rpd: number) {
    this.requestsPerMinute = rpm;
    this.requestsPerDay = rpd;
    this.minuteTokens = rpm;
    this.dayTokens = rpd;
    this.lastRefillMinute = Date.now();
    this.lastRefillDay = Date.now();
  }

  private refillTokens() {
    const now = Date.now();

    // Refill minute tokens
    if (now - this.lastRefillMinute >= 60000) {
      this.minuteTokens = this.requestsPerMinute;
      this.lastRefillMinute = now;
    }

    // Refill day tokens
    if (now - this.lastRefillDay >= 86400000) {
      this.dayTokens = this.requestsPerDay;
      this.lastRefillDay = now;
    }
  }

  public async acquire(): Promise<void> {
    this.refillTokens();

    if (this.minuteTokens <= 0 || this.dayTokens <= 0) {
      throw new Error('Rate limit exceeded. Please wait before making more requests.');
    }

    this.minuteTokens--;
    this.dayTokens--;
  }
}