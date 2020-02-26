import { writable, derived } from 'svelte/store';

export const dirtyStore = writable({});
export const errorsStore = writable({});
export const isValidatingStore = writable(false);

export const state = derived(
  [dirtyStore, errorsStore, isValidatingStore],
  ([$dirtyStore, $errorsStore, $isValidatingStore]) => ({
    dirty: $dirtyStore,
    errors: $errorsStore,
    isValidating: $isValidatingStore
  }));
