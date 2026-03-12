<script lang="ts">
  import { Engine } from '$lib/game/Engine.svelte';
  import { GameStatus, ShapeType } from '$lib/game/types';
  import Shape from '$lib/Shape.svelte';
  import backgroundImage from '$lib/assets/arkaplan.webp';

  const engine = new Engine();

  function handleAction() {
    if (engine.status === GameStatus.START || engine.status === GameStatus.GAMEOVER) {
      engine.start();
    } else {
      engine.player.jump();
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
      handleAction();
    }
  }

  function onMouseDown(e: MouseEvent) {
    if (e.button === 0) {
      handleAction();
    }
  }
</script>

<svelte:window onkeydown={onKeyDown} onmousedown={onMouseDown} />

<main>
  <div class="game-container">
    <div class="hud">
      <div class="score">SCORE: {engine.score}</div>
      <div class="high-score">HI: {engine.highScore}</div>
    </div>

    <div class="game-board" style:--bg-image="url({backgroundImage})">
      <div class="ground"></div>
      
      <!-- Player -->
      <div 
        class="entity player" 
        style:left="{engine.player.x}px" 
        style:top="{engine.player.y}px"
        style:transform="rotate({engine.player.rotation}deg) scale({engine.player.scaleX}, {engine.player.scaleY})"
        style:transform-origin="center"
      >
        <Shape 
          type={ShapeType.SQUARE} 
          width={engine.player.width} 
          height={engine.player.height} 
          color="#3498db" 
          isPlayer={true}
          isJumping={engine.player.isJumping}
        />
      </div>

      <!-- Obstacles -->
      {#each engine.obstacles as obstacle (obstacle.id)}
        <div class="entity obstacle" style:left="{obstacle.x}px" style:top="{obstacle.y}px">
          <Shape type={obstacle.type} width={obstacle.width} height={obstacle.height} color={obstacle.color} />
        </div>
      {/each}

      {#if engine.status === GameStatus.START}
        <div class="overlay">
          <h1>ZIP ZIP</h1>
          <p>Press W, UP or CLICK to Start</p>
        </div>
      {:else if engine.status === GameStatus.GAMEOVER}
        <div class="overlay">
          <h1>GAME OVER</h1>
          <p>Score: {engine.score}</p>
          <p>Press W, UP or CLICK to Restart</p>
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Courier New', Courier, monospace;
    background-color: #f0f0f0;
    user-select: none;
    overflow: hidden;
  }

  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .game-container {
    width: 800px;
    height: 400px;
    background-color: white;
    border: 4px solid #333;
    position: relative;
    overflow: hidden;
  }

  .game-board {
    width: 100%;
    height: 100%;
    position: relative;
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
  }

  .ground {
    position: absolute;
    bottom: 100px;
    width: 100%;
    height: 2px;
    background-color: #333;
  }

  .entity {
    position: absolute;
  }

  .hud {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    gap: 20px;
    font-weight: bold;
    z-index: 10;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 20;
  }

  h1 {
    margin: 0;
    font-size: 3rem;
    color: #333;
  }

  p {
    font-size: 1.2rem;
    color: #666;
  }
</style>
