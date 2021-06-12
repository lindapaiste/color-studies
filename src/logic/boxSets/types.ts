import { ChannelAdapter } from "../colorspaces/ChannelAdapter";
import { ColorAdapter } from "../convert";

export interface Levers {
  minDistance: number;
  maxDistance: number;
  minDistinctness: number;
  maxDistinctness: number;
}

export interface Evaluation<T = ColorAdapter> {
  color: T;
  match: T;
  distance: number;
  distinctness: number;
  distances: number[];
}

export interface GetDistance<T> {
  (a: T, b: T): number;
}

export interface ChannelShiftSettings {
  channel: ChannelAdapter;
  shift: number;
  colorCount: number;
}

export interface BoxData<T = ColorAdapter> {
  color: T; // the box color
  matches: Evaluation<T>[]; // the balls
  rejected?: Rejection<T>[]; // rejected balls
}

export interface Rejection<T = ColorAdapter> extends Evaluation<T> {
  error: MatchError;
}

export interface MatchError {
  code: ErrorCode;
  message: string;
}

export enum ErrorCode {
  WRONG_MATCH,
  DISTANCE_TOO_LARGE,
  DISTANCE_TOO_SMALL,
  DISTINCTNESS_TOO_LARGE,
  DISTINCTNESS_TOO_SMALL,
}

/**
 * for converting to something the game can understand
 */

export interface JsonBall {
  color: string;
  correctBox: number;
}

export interface JsonBox {
  color: string;
}

export interface JsonLevel {
  boxes: JsonBox[];
  balls: JsonBall[];
}
