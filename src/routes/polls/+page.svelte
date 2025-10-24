<script>
  import { resolve } from '$app/paths';
    import Container from '$lib/components/Container/Container.svelte';
  import ListNotFound from '$lib/components/ListNotFound/ListNotFound.svelte';
</script>

<Container>
  <div class="-mx-4 -mt-4 pb-[72px]">
    <ListNotFound>
      No Polls Found :(<br /><a class="text-primary-600 underline" href={resolve('/polls/new')}>Create a first one</a>
    </ListNotFound>
  </div>
</Container>
