import { Player } from './Player.svelte';
import { Obstacle } from './Obstacle.svelte';
import { GameStatus, ShapeType } from './types';
import { browser } from '$app/environment';

export class Engine {
  status = $state(GameStatus.START);
  player = new Player();
  obstacles = $state<Obstacle[]>([]);
  score = $state(0);
  highScore = $state(0);
  
  groundY = 300;
  lastSpawnTime = 0;
  spawnInterval = 1500;
  
  animationFrameId: number | null = null;
  lastTime = 0;

  constructor() {
    if (browser) {
      this.highScore = Number(localStorage.getItem('highScore')) || 0;
    }
  }

  start() {
    if (this.status === GameStatus.PLAYING) return;
    
    if (browser && this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.status = GameStatus.PLAYING;
    this.score = 0;
    this.obstacles = [];
    this.player.reset();
    this.lastSpawnTime = 0;
    this.spawnInterval = 1500;
    
    if (browser) {
      this.lastTime = performance.now();
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  }

  gameOver() {
    if (this.status === GameStatus.GAMEOVER) return;
    
    this.status = GameStatus.GAMEOVER;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      if (browser) {
        localStorage.setItem('highScore', this.highScore.toString());
      }
    }
    if (browser && this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  loop = (currentTime: number) => {
    if (this.status !== GameStatus.PLAYING) {
      this.animationFrameId = null;
      return;
    }
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    
    if (this.status === GameStatus.PLAYING) {
      this.animationFrameId = requestAnimationFrame(this.loop);
    } else {
      this.animationFrameId = null;
    }
  };

  update(deltaTime: number) {
    this.player.update();

    // 1. Check Ground Collision (Base Case)
    if (this.player.y + this.player.height > this.groundY) {
        this.landOn(this.groundY);
    }

    // 2. Spawn obstacles
    this.lastSpawnTime += deltaTime;
    if (this.lastSpawnTime > this.spawnInterval) {
      this.spawnObstacle();
      this.lastSpawnTime = 0;
      this.spawnInterval = Math.max(800, 1500 - (this.score * 10));
    }

    // 3. Update obstacles and collisions
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      obstacle.update();
if (this.checkCollision(this.player, obstacle)) {
  if (obstacle.isSolid) {
      const prevBottom = this.player.prevY + this.player.height;
      const currentBottom = this.player.y + this.player.height;

      // LANDING CHECK: 
      // 1. Was previously above the platform top? (prevBottom <= obstacle.y)
      // 2. Is currently falling? (velocityY >= 0)
      if (prevBottom <= obstacle.y && this.player.velocityY >= 0) {
          this.landOn(obstacle.y);
      } else {
          // Side hit or from below
          this.gameOver();
          return;
      }
  } else {
      this.gameOver();
      return;
  }
}

      if (obstacle.isOffScreen) {
        this.obstacles.splice(i, 1);
        this.score += 1;
      }
    }
  }

  landOn(surfaceY: number) {
    const wasJumping = this.player.isJumping;
    this.player.y = surfaceY - this.player.height;
    this.player.velocityY = 0;
    this.player.isJumping = false;
    this.player.rotation = this.player.targetRotation;

    if (wasJumping) {
        this.player.scaleX = 1.4;
        this.player.scaleY = 0.6;
    }
  }

  spawnObstacle() {
    if (Math.random() < 1.0) { // Keep testing at 100%
        this.spawnPlatformChallenge();
        return;
    }

    const types = [ShapeType.SQUARE, ShapeType.TRIANGLE, ShapeType.CIRCLE, ShapeType.RECTANGLE];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const speed = 5 + Math.floor(this.score / 10);
    const y = randomType === ShapeType.RECTANGLE ? 300 - 60 : 300 - 40;

    const obstacle = new Obstacle(800, y, randomType, speed, '#e74c3c');
    this.obstacles.push(obstacle);
  }

  spawnPlatformChallenge() {
    const speed = 5 + Math.floor(this.score / 10);
    const startX = 800;
    
    // Platform is now 120px wide (3x wider than before)
    const platformWidth = 120;
    const platform = new Obstacle(startX, 300 - 40, ShapeType.SQUARE, speed, '#000000', true, platformWidth);
    this.obstacles.push(platform);

    // Spikes (now positioned relative to the wider platform)
    for (let i = 0; i < 5; i++) {
        const spike = new Obstacle(startX + platformWidth + (i * 40), 300 - 40, ShapeType.TRIANGLE, speed, '#ff0000', false);
        this.obstacles.push(spike);
    }
  }

  checkCollision(player: Player, obstacle: Obstacle) {
    const p = player.rect;
    const o = obstacle.rect;
    return (
      p.x < o.x + o.width &&
      p.x + p.width > o.x &&
      p.y < o.y + o.height &&
      p.y + p.height > o.y
    );
  }
}
