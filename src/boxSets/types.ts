export interface Levers {
  minDistance: number;
  maxDistance: number;
  minDistinctness: number;
  maxDistinctness: number;
}

export interface Evaluation<T> {
  match: T;
  distance: number;
  distinctness: number;
}

export interface GetDistance<T> {
  (a: T, b: T): number;
}
