<script lang="ts">
  import BottomActions from '$lib/components/BottomActions/BottomActions.svelte';
  import { Alert, Button, GradientButton, Helper, Input, Label, Modal, Textarea, Toast } from 'flowbite-svelte';
  import { createForm } from 'svelte-forms-lib';
  import {
    ArchiveArrowDownSolid,
    ArrowLeftOutline,
    BanOutline,
    CheckCircleSolid,
    ExclamationCircleSolid,
    EyeSlashSolid,
    EyeSolid,
    CloseOutline,
    UploadSolid
  } from 'flowbite-svelte-icons';
  import * as yup from 'yup';
  import QuestionView from '$lib/components/QuestionView/QuestionView.svelte';
  import { blur, fade } from 'svelte/transition';
  import { addQuestion, archiveQuestion, unarchiveQuestion, updateQuestion } from '$lib/api/questions';
  import { resolve } from '$app/paths';
  import { goto } from '$app/navigation';

  let preview = $state(false);

  interface Props {
    initialValues: {
      question: string;
      description: string;
      positive: string;
      negative: string;
    };
    archived?: boolean;
    edit?: boolean;
    id?: number;
  }

  let { initialValues, edit, id, archived }: Props = $props();

  const {
    form,
    handleChange,
    handleSubmit,
    errors,
    state: formState,
    handleReset
  } = createForm({
    initialValues,
    validationSchema: yup.object().shape({
      question: yup.string().required('Question is required'),
      description: yup.string(),
      positive: yup.string().required('Text is required').max(10, 'Maximum 10 characters allowed'),
      negative: yup.string().required('Text is required').max(10, 'Maximum 10 characters allowed')
    }),
    onSubmit: async (values) => {
      try {
        await (edit ? updateQuestion(id!, values) : addQuestion(values));
        addSuccessToast = true;
        if (!edit) {
          handleReset();
        }
      } catch (error) {
        console.error(`Error ${edit ? 'editing' : 'adding'} question:`, error);
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

  let archiveModal = $state(false);

  let archiveErrorToast = $state(false);

  const handleArchive = async ({ action }: { action: string }) => {
    try {
       if (action === 'yes') {
        await archiveQuestion(id!);
        goto(resolve('/questions'));
      }
    } catch (error) {
      console.error('Error archiving question:', error);
      archiveErrorToast = true;
      setTimeout(() => {
        archiveErrorToast = false;
      }, 3000);
    }
  };

  let unarchiveModal = $state(false);
  let unarchiveErrorToast = $state(false);

  const handleUnarchive = async ({ action }: { action: string }) => {
    try {
       if (action === 'yes') {
        await unarchiveQuestion(id!);
        goto(resolve('/questions'));
      }
    } catch (error) {
      console.error('Error unarchiving question:', error);
      unarchiveErrorToast = true;
      setTimeout(() => {
        unarchiveErrorToast = false;
      }, 3000);
    }
  };

  const FORM_ID = 'question-form';
</script>

<div class="mx-auto prose pb-[72px] dark:prose-invert">
  {#if preview}
    <Alert color="secondary" class="justify-center p-2 text-center text-xs">
      {#snippet icon()}<EyeSolid class="h-4 w-4" />{/snippet}
      Preview mode
    </Alert>
    <QuestionView question={$form.question} description={$form.description} positive={$form.positive} negative={$form.negative} />
  {:else}
    <div class="flex items-baseline justify-between gap-2">
      <h3 class="mt-0">{edit ? 'Edit Question' : 'Create a New Question'}</h3>
      {#if edit}
        <a href={resolve('/questions')} class="inline-flex items-baseline gap-1 text-sm underline"
          ><ArrowLeftOutline class="inline-block h-5 w-5 translate-y-1" />To Questions</a
        >
      {/if}
    </div>
    <form onsubmit={handleSubmit} id={FORM_ID}>
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
  {#if edit && !archived}
    <GradientButton class="px-3!" color="purple" onclick={() => (archiveModal = true)}>
      <ArchiveArrowDownSolid />
    </GradientButton>
  {/if}
  {#if edit && archived}
    <GradientButton class="px-3!" color="purple" onclick={() => (unarchiveModal = true)}>
      <UploadSolid />
    </GradientButton>
  {/if}
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
  <Button disabled={preview} class="flex flex-1 gap-1" type="submit" form={FORM_ID}>
    <CheckCircleSolid /><span>Save</span>
  </Button>
</BottomActions>

<Modal bind:open={archiveModal} class="w-sm" size="xs" form onaction={handleArchive} transition={fade} focustrap>
  <div class="mt-6 flex gap-2 text-lg font-semibold">
    <ExclamationCircleSolid class="mt-0.5 h-6 w-6 text-red-300" />
    <span>Are you sure you want to archive this question?</span>
  </div>
  <div class="mt-7 flex justify-between gap-2">
    <Button type="submit" class="flex flex-1 gap-1" value="no" outline color="alternative">
      <CloseOutline />
      No
    </Button>
    <GradientButton type="submit" class="flex flex-1 gap-1" value="yes" color="purple">
      <ArchiveArrowDownSolid />
      Yes
    </GradientButton>
  </div>
</Modal>

<Modal bind:open={unarchiveModal} class="w-sm" size="xs" form onaction={handleUnarchive} transition={fade} focustrap>
  <div class="mt-6 flex gap-2 text-lg font-semibold">
    <ExclamationCircleSolid class="mt-0.5 h-6 w-6 text-red-300" />
    <span>Are you sure you want to unarchive this question?</span>
  </div>
  <div class="mt-7 flex justify-between gap-2">
    <Button type="submit" class="flex flex-1 gap-1" value="no" outline color="alternative">
      <CloseOutline />
      No
    </Button>
    <GradientButton type="submit" class="flex flex-1 gap-1" value="yes" color="purple">
      <UploadSolid />
      Yes
    </GradientButton>
  </div>
</Modal>

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
  Question {edit ? 'updated' : 'added'} successfully!<br />
  <a href={resolve(`/questions`)} class="underline">Goto Questions list</a>
</Toast>

<Toast transition={blur} bind:toastStatus={addErrorToast} class="fixed right-2 bottom-20" position="bottom-right" color="red">
  {#snippet icon()}
    <BanOutline />
  {/snippet}
  Cannot {edit ? 'update' : 'add'} the question. Please try again.
</Toast>

<Toast transition={blur} bind:toastStatus={archiveErrorToast} class="fixed right-2 bottom-20" position="bottom-right" color="red">
  {#snippet icon()}
    <BanOutline />
  {/snippet}
  Cannot archive the question. Please try again.
</Toast>

<Toast transition={blur} bind:toastStatus={unarchiveErrorToast} class="fixed right-2 bottom-20" position="bottom-right" color="red">
  {#snippet icon()}
    <BanOutline />
  {/snippet}
  Cannot unarchive the question. Please try again.
</Toast>
