<script lang="ts">
  import { onMount } from "svelte";
  
  let {
    videoUrl,
    title = "",
    posterUrl = "",
    autoplay = false,
    controls = true,
    muted = false,
    loop = false,
    width = "100%",
    height = "auto"
  } = $props();
  
  let player: HTMLVideoElement;
  let isPlaying = $state(false);
  
  onMount(() => {
    if (player && autoplay) {
      player.play().catch(err => {
        console.error("Autoplay failed:", err);
      });
    }
  });
  
  function togglePlay() {
    if (player) {
      if (player.paused) {
        player.play();
        isPlaying = true;
      } else {
        player.pause();
        isPlaying = false;
      }
    }
  }
  
  function handlePlayPause() {
    isPlaying = !player.paused;
  }
</script>

<div class="video-container relative rounded-lg overflow-hidden" style="width: {width};">
  {#if title}
    <h3 class="text-lg font-medium mb-2">{title}</h3>
  {/if}
  
  <div class="relative aspect-video bg-black">
    <!-- Video element -->
    <video
      bind:this={player}
      src={videoUrl}
      poster={posterUrl}
      {controls}
      {muted}
      {loop}
      on:play={handlePlayPause}
      on:pause={handlePlayPause}
      class="w-full h-full object-contain"
    >
      <track kind="captions" />
      Your browser does not support the video tag.
    </video>
    
    <!-- Custom play button overlay (shown when controls are disabled) -->
    {#if !controls}
      <button
        on:click={togglePlay}
        class="absolute inset-0 w-full h-full flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {#if !isPlaying}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-white">
            <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-white">
            <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clip-rule="evenodd" />
          </svg>
        {/if}
      </button>
    {/if}
  </div>
  
  <slot />
</div>

<style>
  .video-container {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
</style>