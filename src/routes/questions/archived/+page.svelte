<script lang="ts">
  import { resolve } from '$app/paths';
    import Container from '$lib/components/Container/Container.svelte';
  import QuestionsList from '$lib/components/QuestionsList/QuestionsList.svelte';
    import QuestionsListSkeleton from '$lib/components/QuestionsListSkeleton/QuestionsListSkeleton.svelte';
  import { db } from '$lib/db';
  import { liveQuery } from 'dexie';

  let questions = liveQuery(() => db.questions.where('archivedAt').notEqual(0).toArray());
</script>

<Container>
  <div class="-mx-4 -mt-4 pb-[72px]">
    {#if $questions}
      {#if $questions.length}
        <QuestionsList questions={$questions} />
      {:else}
        <div class="mt-10 text-center text-xl">
          No Archived Questions Found :(<br /><a class="underline" href={resolve('/questions')}>Go back to Questions List</a>!
        </div>
      {/if}
    {:else}
      <QuestionsListSkeleton />
    {/if}
  </div>
</Container>
