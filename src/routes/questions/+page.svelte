<script lang="ts">
  import { liveQuery } from 'dexie';
  import { resolve } from '$app/paths';
  import { GradientButton } from 'flowbite-svelte';
  import { ArchiveSolid } from 'flowbite-svelte-icons';
  import BottomActions from '$lib/components/BottomActions/BottomActions.svelte';
  import QuestionsList from '$lib/components/QuestionsList/QuestionsList.svelte';
  import QuestionsListSkeleton from '$lib/components/QuestionsListSkeleton/QuestionsListSkeleton.svelte';
  import ListNotFound from '$lib/components/ListNotFound/ListNotFound.svelte';
  import Container from '$lib/components/Container/Container.svelte';
  import { getArchivedQuestions, getUnArchivedQuestions } from '$lib/api/questions';

  let questions = liveQuery(getUnArchivedQuestions);
  let archivedQuestions = liveQuery(getArchivedQuestions);
</script>

<Container>
  <div class="-mx-4 -mt-4 pb-[72px]">
    {#if $questions}
      {#if $questions.length}
        <QuestionsList questions={$questions} />
      {:else}
        <ListNotFound>
          No Questions Found :(<br /><a class="underline text-primary-600" href={resolve('/questions/new')}>Create a first one</a>
        </ListNotFound>
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
</Container>
