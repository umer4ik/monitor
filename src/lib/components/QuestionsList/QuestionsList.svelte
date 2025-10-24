<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Question } from '$lib/types/db-entities';
  import { Button } from 'flowbite-svelte';
  import { ArchiveSolid, PenSolid } from 'flowbite-svelte-icons';

  interface Props {
    questions: Question[];
  }
  let { questions }: Props = $props();
</script>

<ul>
  {#each questions as question (question.id)}
    <li class="flex border-b border-b-gray-300 dark:border-b-white">
      <div class="flex-1 p-4 text-xl font-semibold flex items-center gap-2">
        {#if question.archivedAt}
          <ArchiveSolid class="w-6 h-6 translate-y-px" />
        {/if}
        {question.question}
      </div>
      <Button href={resolve(`/questions/${question.id}`)} class="rounded-none" color="primary">
        <PenSolid class="h-6 w-6" />
      </Button>
    </li>
  {/each}
</ul>
