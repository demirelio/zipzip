<script lang="ts">
  import { ShapeType } from './game/types';

  let { type, width, height, color = '#3498db', isPlayer = false, isJumping = false } = $props();

  let points = $derived.by(() => {
    if (type === ShapeType.TRIANGLE) {
      return `0,${height} ${width / 2},0 ${width},${height}`;
    }
    return '';
  });

  // Face coordinates (normalized to 40x40)
  const eyeY = 15;
  const leftEyeX = 12;
  const rightEyeX = 28;
  const mouthY = 28;
</script>

<div class="shape" class:shaking={isPlayer && isJumping} style:--width="{width}px" style:--height="{height}px">
  <svg {width} {height} viewBox="0 0 {width} {height}">
    {#if type === ShapeType.SQUARE || type === ShapeType.RECTANGLE}
      <rect width={width} height={height} fill={color} rx="4" />
    {:else if type === ShapeType.CIRCLE}
      <circle cx={width / 2} cy={height / 2} r={width / 2} fill={color} />
    {:else if type === ShapeType.TRIANGLE}
      <polygon {points} fill={color} />
    {/if}

    {#if isPlayer}
      <!-- Eyes -->
      <circle cx={leftEyeX} cy={eyeY} r={isJumping ? 3 : 2} fill="#333" />
      <circle cx={rightEyeX} cy={eyeY} r={isJumping ? 3 : 2} fill="#333" />

      <!-- Mouth -->
      {#if isJumping}
        <!-- Shaking/Zigzag mouth for 🫨 expression -->
        <path 
          d="M 12 30 L 16 26 L 20 30 L 24 26 L 28 30" 
          fill="none" 
          stroke="#333" 
          stroke-width="2" 
          stroke-linecap="round"
        />
      {:else}
        <!-- Neutral mouth -->
        <line x1="12" y1={mouthY} x2="28" y2={mouthY} stroke="#333" stroke-width="2" stroke-linecap="round" />
      {/if}
    {/if}
  </svg>
</div>

<style>
  .shape {
    display: inline-block;
    width: var(--width);
    height: var(--height);
  }

  .shaking {
    animation: shake 0.1s infinite;
  }

  @keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    25% { transform: translate(-1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 1px) rotate(-1deg); }
    75% { transform: translate(1px, -1px) rotate(0deg); }
    100% { transform: translate(1px, 1px) rotate(0deg); }
  }
</style>
