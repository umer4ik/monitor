<script lang="ts">
  import BottomActions from '$lib/components/BottomActions/BottomActions.svelte';
  import { Alert, Button, Helper, Input, Label, Textarea, Toast } from 'flowbite-svelte';
  import { createForm } from 'svelte-forms-lib';
  import { BanOutline, CheckCircleSolid, EyeSlashSolid, EyeSolid } from 'flowbite-svelte-icons';
  import * as yup from 'yup';
  import QuestionView from '$lib/components/QuestionView/QuestionView.svelte';
  import { blur } from 'svelte/transition';
  import { addQuestion } from '$lib/api/questions';

  let preview = $state(false);

  const {
    form,
    handleChange,
    handleSubmit,
    errors,
    state: formState,
    handleReset,
  } = createForm({
    initialValues: {
      question: '',
      description: '',
      positive: 'Yes',
      negative: 'No'
    },
    validationSchema: yup.object().shape({
      question: yup.string().required('Question is required'),
      description: yup.string(),
      positive: yup.string().required('Text is required').max(10, 'Maximum 10 characters allowed'),
      negative: yup.string().required('Text is required').max(10, 'Maximum 10 characters allowed')
    }),
    onSubmit: async (values) => {
      try {
        await addQuestion(values);
        addSuccessToast = true;
        handleReset();
      } catch (error) {
        console.error('Error adding question:', error);
        addErrorToast = true;
      }
      if (createToastTimeout) {
        clearTimeout(createToastTimeout);
      }
      createToastTimeout = setTimeout(() => {
        addSuccessToast = false;
        addErrorToast = false;
      }, 3000);
    }
  });

  let cannotPreviewToast = $state(false);
  let previewToastTimeout: NodeJS.Timeout | null = null;

  let addSuccessToast = $state(false);
  let addErrorToast = $state(false);
  let createToastTimeout: NodeJS.Timeout | null = null;

  const handlePreview = () => {
    console.log($formState);
    if ($formState.isValid && $formState.form.question.trim()) {
      preview = !preview;
      return;
    }
    cannotPreviewToast = true;
    if (previewToastTimeout) {
      clearTimeout(previewToastTimeout);
    }
    previewToastTimeout = setTimeout(() => {
      cannotPreviewToast = false;
    }, 3000);
  };
</script>

<svelte:head>
  <title>Create a New Question</title>
</svelte:head>

<div class="prose pb-[72px] dark:prose-invert mx-auto">
  {#if preview}
    <Alert color="secondary" class="justify-center p-2 text-center text-xs">
      {#snippet icon()}<EyeSolid class="h-4 w-4" />{/snippet}
      Preview mode
    </Alert>
    <QuestionView question={$form.question} description={$form.description} positive={$form.positive} negative={$form.negative} />
  {:else}
    <h3>Create a new question</h3>
    <p>Use the form below to create a new question.</p>
    <form onsubmit={handleSubmit} id="create-question-form">
      <div class="flex flex-col gap-4">
        <div>
          <Label for="question" class="mb-2">Question</Label>
          <Input
            name="question"
            id="question"
            type="text"
            color={$errors.question ? 'red' : 'default'}
            onchange={handleChange}
            bind:value={$form.question}
            placeholder="Enter your question here"
          />
          {#if $errors.question}
            <Helper color="red" class="mt-1 mb-0!">{$errors.question}</Helper>
          {:else}
            <Helper class="mt-1 mb-0!"
              >Try something straightforward like "Did you sleep well last night?".<br />And don't forget the question mark</Helper
            >
          {/if}
        </div>
        <div>
          <Label for="description" class="mb-2">Description</Label>
          <Textarea
            class="w-full"
            name="description"
            id="description"
            rows={4}
            color="default"
            onchange={handleChange}
            bind:value={$form.description}
            placeholder="Enter question description here"
          />
        </div>
        <div class="flex gap-2">
          <div class="flex-1">
            <Label for="negative" class="mb-2">Negative Text</Label>
            <Input
              name="negative"
              id="negative"
              type="text"
              onchange={handleChange}
              bind:value={$form.negative}
              color={$errors.negative ? 'red' : 'default'}
            />
            {#if $errors.negative}
              <Helper color="red" class="mt-1 mb-0!">{$errors.negative}</Helper>
            {/if}
          </div>
          <div class="flex-1">
            <Label for="positive" class="mb-2">Positive Text</Label>
            <Input
              name="positive"
              id="positive"
              type="text"
              onchange={handleChange}
              bind:value={$form.positive}
              color={$errors.positive ? 'red' : 'default'}
            />
            {#if $errors.positive}
              <Helper color="red" class="mt-1 mb-0!">{$errors.positive}</Helper>
            {/if}
          </div>
        </div>
      </div>
    </form>
  {/if}
</div>
<BottomActions>
  <Button class="flex flex-1 gap-1" color="secondary" onclick={handlePreview}>
    {#if preview}
      <EyeSlashSolid />
    {:else}
      <EyeSolid />
    {/if}
    <span>
      {preview ? 'Exit Preview' : 'Preview'}
    </span>
  </Button>
  <Button disabled={preview} class="flex flex-1 gap-1" type="submit" form="create-question-form">
    <CheckCircleSolid /><span>Save</span>
  </Button>
</BottomActions>

<Toast transition={blur} bind:toastStatus={cannotPreviewToast} class="fixed right-2 bottom-20" position="bottom-right" color="red">
  {#snippet icon()}
    <BanOutline />
  {/snippet}
  Cannot preview the question. Please fill the form first.
</Toast>

<Toast transition={blur} bind:toastStatus={addSuccessToast} class="fixed right-2 bottom-20" position="bottom-right" color="green">
  {#snippet icon()}
    <CheckCircleSolid />
  {/snippet}
  Question added successfully!
</Toast>

<Toast transition={blur} bind:toastStatus={addErrorToast} class="fixed right-2 bottom-20" position="bottom-right" color="red">
  {#snippet icon()}
    <BanOutline />
  {/snippet}
  Cannot add the question. Please try again.
</Toast>
