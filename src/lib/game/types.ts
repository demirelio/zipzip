export enum ShapeType {
  SQUARE = 'SQUARE',
  TRIANGLE = 'TRIANGLE',
  CIRCLE = 'CIRCLE',
  RECTANGLE = 'RECTANGLE'
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER'
}
