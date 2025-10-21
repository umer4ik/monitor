<script lang="ts">
  import { liveQuery } from "dexie";
  import { db } from "$lib/db";
  import { resolve } from "$app/paths";
  import { Button } from "flowbite-svelte";
  import { PenSolid } from "flowbite-svelte-icons";

  let questions = liveQuery(() => db.questions.toArray())
</script>

<div class="-mx-4 -mt-4">
  {#if $questions}
    {#if $questions.length}
      <div>
        {#each $questions as question (question.id)}
          <div class="border-b border-b-white flex">
            <div class="text-xl font-semibold flex-1 p-4">
              {question.question}
            </div>
            <Button href={resolve(`/questions/${question.id}`)} class="rounded-none" color="primary">
              <PenSolid class="h-6 w-6" />
            </Button>
          </div>
        {/each}
      </div>
    {:else}
    <div class="text-xl text-center">
      No Questions Found :(<br /><a class="underline" href={resolve('/create')}>Create a first one</a>!
    </div>
    {/if}
  {/if}
</div>