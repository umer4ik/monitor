<script lang="ts">
  import { liveQuery } from 'dexie';
  import { db } from '$lib/db';
  import { resolve } from '$app/paths';
  import { GradientButton } from 'flowbite-svelte';
  import { ArchiveSolid } from 'flowbite-svelte-icons';
  import BottomActions from '$lib/components/BottomActions/BottomActions.svelte';
  import QuestionsList from '$lib/components/QuestionsList/QuestionsList.svelte';
    import QuestionsListSkeleton from '$lib/components/QuestionsListSkeleton/QuestionsListSkeleton.svelte';

  let questions = liveQuery(() => db.questions.where('archivedAt').equals(0).toArray());
  let archivedQuestions = liveQuery(() => db.questions.where('archivedAt').notEqual(0).toArray());
  $effect(() => {
    console.log($questions);
  });
</script>

<div class="mx-auto max-w-[65ch]">
  <div class="-mx-4 -mt-4 pb-[72px]">
    {#if $questions}
      {#if $questions.length}
        <QuestionsList questions={$questions} />
      {:else}
        <div class="mt-10 text-center text-xl">
          No Questions Found :(<br /><a class="underline" href={resolve('/create')}>Create a first one</a>!
        </div>
      {/if}
    {:else}
      <QuestionsListSkeleton />
    {/if}
  </div>
  {#if $archivedQuestions && $archivedQuestions.length}
    <BottomActions>
      <GradientButton href={resolve('/questions/archived')} color="purple" class="flex w-full gap-1">
        <ArchiveSolid />
        View Archived Questions ({$archivedQuestions.length})
      </GradientButton>
    </BottomActions>
  {/if}
</div>
