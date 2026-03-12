import { ShapeType } from './types';

export class Obstacle {
  id = Math.random().toString(36).substring(7);
  x = $state(0);
  y = $state(0);
  width = $state(40);
  height = $state(40);
  speed = $state(5);
  type: ShapeType = ShapeType.SQUARE;
  color = $state('#ff0000');
  isSolid = $state(false);

  constructor(x: number, y: number, type: ShapeType, speed: number, color: string = '#ff0000', isSolid: boolean = false, customWidth?: number) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.speed = speed;
    this.color = color;
    this.isSolid = isSolid;
    
    // Default sizes
    if (this.type === ShapeType.TRIANGLE) {
      this.width = 40;
      this.height = 40;
    } else if (this.type === ShapeType.RECTANGLE) {
      this.width = 30;
      this.height = 60;
    } else {
      this.width = 40;
      this.height = 40;
    }

    // Apply custom width if provided
    if (customWidth) {
        this.width = customWidth;
    }
  }

  update() {
    this.x -= this.speed;
  }

  get rect() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  get isOffScreen() {
    return this.x + this.width < -100; // Extra margin for groups
  }
}
