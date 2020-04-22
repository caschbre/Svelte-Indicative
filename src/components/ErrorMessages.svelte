<script>
  import { state } from '../stores.js';
  import { exclude } from '../utils/exclude.js';

  export let field;
</script>

{#if field && $state.errors[field]}
  <div class="si-errors" {...exclude($$props, ['field'])}>
    {#each $state.errors[field] as error}
      <div class="si-error">{error.message}</div>
    {/each}
  </div>
{/if}

<style>
.si-errors {
  color: var(--si-errors-color, darkred);
}

.si-error {
  margin: var(--si-errors-padding, 2px 0);
}
</style>
