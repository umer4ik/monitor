<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { getQuestionById } from "$lib/api/questions";
  import QuestionForm from "$lib/components/QuestionForm/QuestionForm.svelte";
  import type { Question } from "$lib/db";
  import { Skeleton } from "flowbite-svelte";
  import { onMount } from "svelte";

  const questionId = page.params.id;
  let question: Question | null = $state(null);
  let notFound = $state(false);

  const fetchQuestion = async () => {
    if (!questionId) return;
    if (isNaN(+questionId)) {
      notFound = true;
      return;
    }
    const result = await getQuestionById(+questionId);
    if (result) {
      question = result;
    } else {
      notFound = true
    }
  };

  onMount(() => {
    fetchQuestion();
  })
</script>
<svelte:head>
  <title>{question ? `Question: ${question.question}` : notFound ? 'Question Not Found' : 'Loading...'}</title>
</svelte:head>
<div>
  {#if !question && !notFound}
    <div class="max-w-[65ch] mx-auto mt-10">
      <Skeleton size="2xl" class="flex flex-col gap-2" />
    </div>
  {/if}
  {#if notFound}
    <div class="text-xl text-center mt-10">
      <div>Question Not Found :(</div>
      <a class="underline" href={resolve('/questions')}>Go back to Questions List</a>
    </div>
  {:else if question}
    <QuestionForm
      initialValues={{
        question: question.question,
        description: question.description,
        positive: question.positive,
        negative: question.negative
      }}
      archived={!!question.archivedAt}
      id={question.id}
      edit
    />
  {/if}
</div>