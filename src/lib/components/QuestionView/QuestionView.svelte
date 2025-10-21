<script lang="ts">
  import { Alert, GradientButton  } from 'flowbite-svelte';
    import { InfoCircleOutline, ThumbsDownOutline, ThumbsUpOutline } from 'flowbite-svelte-icons';

  export let question: string;
  export let description: string = '';
  export let positive: string;
  export let negative: string;
</script>

<div class="prose dark:prose-invert">
  <h1 class="text-center mt-22 mb-12!">{question}</h1>
  {#if description}
    <Alert color="primary" class="mt-4">
      {#snippet icon()}<InfoCircleOutline />{/snippet}
      <div class="text-lg">{description}</div>
    </Alert>
  {/if}
  <div class="mt-60 flex justify-center gap-2">
    <GradientButton class="flex-1 text-2xl gap-1" color="red">
      <span>{negative}</span>
      <ThumbsDownOutline class="w-6 h-6 mt-2.5" />
    </GradientButton>
    <GradientButton class="flex-1 text-2xl gap-1" color="greenToBlue">
      <span>{positive}</span>
      <ThumbsUpOutline class="w-6 h-6" />
    </GradientButton>
  </div>
</div>
