<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { DarkMode } from 'flowbite-svelte';
  let activeUrl = $derived(page.url.pathname);
</script>

<header class="py-2 pr-2 pl-4 shadow-sm dark:bg-gray-800 dark:shadow-none">
  <div class="mx-auto flex max-w-[65ch] items-center justify-between gap-4">
    <a href={resolve('/')} class="text-sm font-semibold  {activeUrl === '/' ? 'text-primary-600' : 'dark:text-gray-400 text-gray-700'}">Home</a>
    <a href={resolve('/questions')} class="text-sm font-semibold  {activeUrl === '/questions' ? 'text-primary-600' : 'dark:text-gray-400 text-gray-700'}">Questions</a>
    <a href={resolve('/polls')} class="text-sm font-semibold  {activeUrl === '/polls' ? 'text-primary-600' : 'dark:text-gray-400 text-gray-700'}">Polls</a>
    <DarkMode class="ml-auto" />
  </div>
</header>
