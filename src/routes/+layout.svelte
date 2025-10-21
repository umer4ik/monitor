<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
    import Header from '$lib/components/Header/Header.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Header />
<div class="p-4">
  {@render children?.()}
</div>

