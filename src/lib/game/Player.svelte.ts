import { ShapeType } from './types';

export class Player {
  x = $state(50);
  y = $state(0);
  prevY = 0;
  width = 40;
  height = 40;
  
  velocityY = $state(0);
  gravity = 0.8;
  jumpForce = -15;
  isJumping = $state(false);

  // Squash and Stretch states
  scaleX = $state(1);
  scaleY = $state(1);
  
  // Rotation states
  rotation = $state(0);
  targetRotation = 0;

  constructor() {
    this.reset();
  }

  reset() {
    this.y = 260; // Start on ground
    this.prevY = 260;
    this.velocityY = 0;
    this.isJumping = false;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.targetRotation = 0;
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = this.jumpForce;
      this.isJumping = true;
      this.scaleX = 0.7;
      this.scaleY = 1.4;
      this.targetRotation += 90;
    }
  }

  update() {
    this.prevY = this.y;
    // Basic Physics only
    this.velocityY += this.gravity;
    this.y += this.velocityY;

    // Smooth visual recoveries
    this.scaleX += (1 - this.scaleX) * 0.15;
    this.scaleY += (1 - this.scaleY) * 0.15;

    if (this.isJumping) {
        this.rotation += (this.targetRotation - this.rotation) * 0.1;
    }

    // Visual stretch while moving
    if (this.isJumping && Math.abs(this.velocityY) > 2) {
        const stretchAmount = Math.min(0.3, Math.abs(this.velocityY) * 0.02);
        this.scaleY = 1 + stretchAmount;
        this.scaleX = 1 - stretchAmount;
    }
  }

  get rect() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}
