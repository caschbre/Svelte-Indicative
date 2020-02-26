// @todo add sanitizer.
// @todo option to validate on load. Useful for disabling submit button.
// @todo dynamic load validate / validateAll?

import { dirtyStore, errorsStore, isValidatingStore, state } from './stores.js';
import { validate, validateAll } from 'indicative/validator';

const svelteIndicative = ({ rules, messages, options }) => {
  const resetState = () => {
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

    return !field ? !+Object.values(state.errors).filter(value => value !== false).length : !state.errors[field] || false;
  };

  // @todo combine params with default configuration.
  // @todo initial/default values?
  const validator = (formNode, params) => {
    params = params || {};

    const validateAllFields = params.validateAllFields || false;
    const preValidate = params.preValidate || false;
    const fieldNodes = getFieldNodes();

    formNode.setAttribute('novalidate', true);

    formNode.addEventListener('change', handleChange);
    formNode.addEventListener('reset', handleReset);
    formNode.addEventListener('submit', handleSubmit);

    // @todo how to handle error messages and fields not being dirty?
    if (preValidate) {
      validateForm();
    }

    // This fires on the form when a child element changes so we can
    // handle individual field validation.
    function handleChange(evt) {
      const field = evt.target.name;
      setDirty(field, true);
      validateField(field);
    }

    function handleReset() {
      resetState();
    }

    function handleSubmit(evt) {
      evt.preventDefault();

//      validateForm()
//        .then(console.log)
//        .catch(console.warn);
//        .finally(success => {
//          console.log('foobar', success);
//
//          formNode.dispatchEvent(
//            new CustomEvent('validated', {
//              bubbles: true,
//              cancelable: true,
//              detail: {
//                success
//              }
//            })
//          );
//        });
    }

    async function doValidate(data, validateRules) {
      validateRules = validateRules || rules;

      const validateHandler = validateAllFields ? validateAll : validate;

      isValidatingStore.set(true);

      // @todo validate / validateAll.
      return await validateHandler(data, validateRules, messages, options)
        // @todo clear errors for field or all errors.
        .then(results => {
          Object.keys(results).forEach(clearError);
          return true;
        })
        .catch(errors => {
          let fieldErrors = {};

          errors.forEach(error => {
            if (!fieldErrors[error.field]) {
              fieldErrors[error.field] = [];
            }

            fieldErrors[error.field].push({
              message: error.message,
              rule: error.validation
            });
          });

          for (let [field, values] of Object.entries(fieldErrors)) {
            setError(field, values);
          }

          return false;
        })
        .finally(() => {
          isValidatingStore.set(false);
        });
    }

    async function validateForm() {
      const data = Object.keys(rules).reduce((acc, field) => {
        clearError(field);
        acc[field] = getFieldValues(field);
        return acc;
      }, {});
      return doValidate(data);
    }

    function validateField(field) {
      // We use getFieldValues here instead of the values parameter due to
      // elements like checkboxes, selects, etc. that allow for multi-value.
      const data = { [field]: getFieldValues(field) };
      const validateRules = { [field]: rules[field] };
      clearError(field);
      doValidate(data, validateRules);
    }

    function getFieldValues(field) {
      const { type, subtype } = getFieldType(field);
      const fieldCardinality = getFieldCardinality(field);

      let values;

      if (type === 'select') {
        values = [];

        for (let i = 0; i < fieldNodes[field].options.length; i++) {
          if (fieldNodes[field].options[i].selected) {
            values.push(fieldNodes[field].options[i].value);
          }
        }

        if (fieldCardinality === 'single') {
          values = values[0];
        }
      }

      else if (type === 'radio') {
        values = [];

        for (let i = 0; i < fieldNodes[field].length; i++) {
          if (fieldNodes[field][i].checked) {
            values.push(fieldNodes[field][i].value);
          }
        }
        values = values[0];
      }

      else if (type === 'input' && subtype === 'checkbox') {
        if (fieldCardinality === 'single') {
          values = fieldNodes[field].checked ? fieldNodes[field].value : '';
        }
        else {
          values = [];

          for (let i = 0; i < fieldNodes[field].length; i++) {
            if (fieldNodes[field][i].checked) {
              values.push(fieldNodes[field][i].value);
            }
          }
        }
      }
      else {
        values = fieldNodes[field].value || '';
      }

      return values;
    }

    function getFieldType(field) {
      const nodeName = fieldNodes[field].nodeName || fieldNodes[field][0].nodeName;
      const nodeType = fieldNodes[field].type || fieldNodes[field][0].type;
      return { type: nodeName.toLowerCase(), subtype: nodeType };
    }

    function getFieldCardinality(field) {
      const { type, subtype } = getFieldType(field);

      if (type === 'select') {
        return (subtype === 'select-one') ? 'single' : 'multiple;'
      }
      else if (type === 'input' && subtype === 'radio') {
        return 'single';
      }

      return fieldNodes[field].length > 0 ? 'multiple' : 'single';
    }

    function setDirty(field, value) {
      dirtyStore.update(current => {
        current[field] = value;
        return current;
      });
    }

    function setError(field, values) {
      errorsStore.update(current => {
        current[field] = values;
        return current;
      });
    }

    function clearError(field) {
      errorsStore.update(current => {
        delete current[field];
        return current;
      });
    }

    function getFieldNodes() {
      return Object.keys(rules).reduce((acc, field) => {
        acc[field] = formNode.elements[field] || null;
        return acc;
      }, {});
    }

    return {
      // Note: this fires after change handler so we are unable to perform the
      // update at this time.
      // update(),
      destroy() {
        formNode.removeEventListener('change', handleChange);
        formNode.removeEventListener('reset', handleReset);
        formNode.removeEventListener('submit', handleSubmit);
      }
    };
  }

  return {
    state,
    isDirty,
    isValid,
    resetState,
    validator
  };
};

export { svelteIndicative };
