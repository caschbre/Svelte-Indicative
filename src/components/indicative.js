// @todo add sanitizer.
// @todo option to validate on load. Useful for disabling submit button.

import { get, writable, derived } from 'svelte/store';
import { validate } from 'indicative/validator';

const svelteIndicative = () => {
  const dirtyStore = writable({});
  const errorsStore = writable({});
  const isValidatingStore = writable(false);

  const reset = () => {
    dirtyStore.set({});
    errorsStore.set({});
    isValidatingStore.set(false);
  };

  const isDirty = (state, field) => {
    return !field ? !!+Object.values(state.dirty).filter(value => !!+value).length : state.dirty[field] || false;
  };

  const isValid = (state, field) => {
    if (!isDirty(state, field)) {
      // @todo return null(?) if not dirty to indicate not validated yet?
      return true;
    }

    return !field ? !+Object.values(state.errors).filter(value => !!+value).length : !state.errors[field] || false;
  };

  // @todo combine params with default configuration.
  const validator = (formNode, params) => {
    // Keep track of the fields to validate. All other fields will be ignored.
    // @todo how to handle dynamic fields / values that exist within the
    // provided schema?
    const fieldNodes = getFieldNodes(params.validationSchema);
    const fieldList = Object.keys(fieldNodes);

    formNode.addEventListener('change', handleChange);
    formNode.addEventListener('reset', handleReset);
    formNode.addEventListener('submit', handleSubmit);

    // This fires on the form element when a child element changes so we can
    // handle individual field validation.
    function handleChange(evt) {
      const { name: field, value } = event.target;
      setDirty(field, true);
      doValidate({ [field]: value }, params);
    }

    function handleReset(evt) {
      reset();
    }

    function handleSubmit(evt) {
      evt.preventDefault();

      // @todo after validating...
      formNode.dispatchEvent(
        new CustomEvent('validated', {
          bubbles: true,
          cancelable: true,
          detail: {
            todo: '@todo what results to provide?',
            params: params,
          }
        })
      );
    }

    async function doValidate(data, params) {
      // messages = messages || {};
      // @todo include cacheKey for performance improvements.
      // @todo include removeAdditional option?
      // options = options || {};

      isValidatingStore.set(true);

      // @todo validate / validateAll.
      await validate(data, params.validationSchema, params.messages, params.options)
        // @todo clear errors for field or all errors.
        .then(console.log)
        .catch(errors => {
          console.warn(errors);
        })
        .finally(() => {
          isValidatingStore.set(false);
        });
    }

    function setDirty(field, value) {
      dirtyStore.update(current => {
        current[field] = value;
        return current;
      });
    };

    function setError(field, values) {
      errorsStore.update(current => {
        current[field] = values;
        return current;
      });
    };

    function clearError(field) {
      errorsStore.update(current => {
        delete current[field];
        return current;
      });
    }

    function getFieldNodes(validationSchema) {
      return Object.keys(validationSchema).reduce((acc, field) => {
        acc[field] = formNode.elements[field] || null;
        return acc;
      }, {});
    }

    return {
      update(params) {
        // @todo
      },
      destroy() {
        formNode.removeEventListener('change', handleChange);
        formNode.removeEventListener('reset', handleReset);
        formNode.removeEventListener('submit', handleSubmit);
      }
    };
  }

  return {
    state: derived([dirtyStore, errorsStore, isValidatingStore], ([$dirtyStore, $errorsStore, $isValidatingStore]) => ({
      dirty: $dirtyStore,
      errors: $errorsStore,
      isValidating: $isValidatingStore
    })),
    isValid: isValid,
    reset,
    validator
  };
};

export { svelteIndicative };
