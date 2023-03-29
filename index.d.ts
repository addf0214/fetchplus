declare function sleep(interval: number): Promise<void>;
declare function retryFetch(url: string, options: RequestInit, retry: number, interval: number): Promise<Response>;
declare function defaultShouldRetry(response: Response): boolean;
declare function fetchPlus(url: string, options: RequestInit, retry?: number, interval?: number, shouldRetry?: typeof defaultShouldRetry): Promise<Response>;
