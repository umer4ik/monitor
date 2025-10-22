<script lang="ts">
  import QuestionForm from "$lib/components/QuestionForm/QuestionForm.svelte";
  
</script>

<svelte:head>
  <title>Create a New Question</title>
</svelte:head>

<QuestionForm initialValues={{ question: '', description: '', positive: 'Yes', negative: 'No' }} />