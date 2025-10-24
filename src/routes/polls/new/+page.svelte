<script lang="ts">
  import { resolve } from '$app/paths';
    import { getUnArchivedQuestions } from '$lib/api/questions';
    import BottomActions from '$lib/components/BottomActions/BottomActions.svelte';
  import Container from '$lib/components/Container/Container.svelte';
    import { liveQuery } from 'dexie';
  import { Button, Helper, Input, Label, MultiSelect, P } from 'flowbite-svelte';
  import { ArrowLeftOutline, CheckCircleSolid } from 'flowbite-svelte-icons';
  import { createForm } from 'svelte-forms-lib';
  import * as yup from 'yup';
  const edit = false;
  const FORM_ID = 'poll-form';

  const initialValues = {
    name: '',
    questions: [] as number[]
  };
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
      name: yup.string().required('Name is required'),
      questions: yup.array().of(yup.number()).min(1, 'At least one question must be selected')
    }),
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
    }
  });

  let questions = liveQuery(async () => {
    const result = await getUnArchivedQuestions();
    return result.map(q => ({
      value: q.id,
      name: q.question,
    }))
  })
</script>

<Container>
  <div class="prose dark:prose-invert">
    <div class="flex items-baseline justify-between gap-2">
      <h3 class="mt-0">{edit ? 'Edit Poll' : 'Create a New Poll'}</h3>
      {#if edit}
        <a href={resolve('/polls')} class="inline-flex items-baseline gap-1 text-sm underline"
          ><ArrowLeftOutline class="inline-block h-5 w-5 translate-y-1" />To Polls</a
        >
      {/if}
    </div>
    <form id={FORM_ID} onsubmit={handleSubmit}>
      <div class="flex flex-col gap-4">
        <div>
          <Label for="name" class="mb-2">Poll Name</Label>
          <Input
            name="name"
            id="name"
            oninput={handleChange}
            type="text"
            color={$errors.name ? 'red' : 'default'}
            bind:value={$form.name}
            placeholder="Enter poll name here"
          />
          {#if $errors.name}
            <Helper color="red" class="mt-1 mb-0!">{$errors.name}</Helper>
          {:else}
            <Helper class="mt-1 mb-0!">You will see this name at a home screen.</Helper>
          {/if}
        </div>
        <div>
          <Label for="questions" class="mb-2">Select Questions</Label>
          <MultiSelect
            name="questions"
            id="questions"
            onchange={(e) => {
              handleChange({
                ...e,
                target: {
                  ...e.target,
                  // @ts-expect-error type mismatch
                  name: 'questions',
                }
              });
            }}
            color={$errors.questions ? 'red' : 'default'}
            bind:value={$form.questions}
            placeholder="Select questions for the poll"
            items={$questions}
          />
          {#if $errors.questions}
            <Helper color="red" class="mt-1 mb-0!">{$errors.questions}</Helper>
          {/if}
        </div>
      </div>
    </form>
  </div>
<BottomActions>
  <Button class="flex flex-1 gap-1" type="submit" form={FORM_ID}>
    <CheckCircleSolid /><span>Save</span>
  </Button>
</BottomActions>
</Container>
