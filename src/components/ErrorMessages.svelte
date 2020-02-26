<script>
  // @todo consider dirty state?
  import { state } from '../stores.js';
  export let field;
</script>

{#if $state.errors.hasOwnProperty(field)}
  <div {...$$props}>
    {#each $state.errors[field] as error}
      <div>{error.message}</div>
    {/each}
  </div>
{/if}
