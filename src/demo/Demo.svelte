<script>
  import { svelteIndicative } from '../indicative.js';
  import ErrorMessages from '../components/ErrorMessages.svelte';

  let indicativeParams = {
    rules: {
      textfield: 'required|string|min:4',
      email: 'required|email|min:10',
      singlecheckbox: 'required',
      multiplecheckboxes: 'min:2',
      radios: 'required',
      multipleselect: 'min:2'
    },
    messages: {
      required: (field, validation, args) => {
        return `${field} is required.`;
      },
      min: `{{ field }} must be {{ args }} chars long.`,
      'textfield.min': (field, validation, args) => {
        return `Textfield must be ${args[0]} characters long.`;
      },
      'multiplecheckboxes.min': `Must check at least {{ args }} items.`,
    },
    // @todo
    // sanitizerSchema: {}
  };

  const { state, isValid, validator } = svelteIndicative({...indicativeParams});
  const validatorOptions = {
    validateAllFields: true,
    preValidate: false,
  };

  let data = {
    textfield: '',
    email: '',
    singlecheckbox: false,
    multiplecheckboxes: [],
    radios: '',
    singleselect: '',
    multipleselect: []
  };

  $: isFormValid = isValid($state);
  $: isFieldValid = (field) => isValid($state, field);
  $: isValidating = $state.isValidating;

  const onChange = (evt) => {
    // Note: Using onchange handler here to avoid updating validator action on
    // every keystroke.
    // Note: The action update handler fires after the onchange event so this
    // approach needs more investigation.
    // staticData = {...data};
  };

  const onSubmit = (evt) => {
    console.log('onSubmit', isValidating, isFormValid);
  };

  const onValidated = (results) => {
    console.log('onValidated', isValidating, isFormValid);
  };
</script>

<form
  id="theform"
  use:validator={validatorOptions}
  on:submit|preventDefault={onSubmit}
  on:validated={onValidated}
  on:change={onChange}
  class:form-invalid={!isFormValid}>

  <div class="form-field">
    <label>Text Field</label>
    <input bind:value={data.textfield} type="text" name="textfield"
    class:invalid={!isFieldValid('textfield')} />
    <ErrorMessages field="textfield" />
  </div>

  <div class="form-field">
    <label>Email Field</label>
    <input bind:value={data.email} type="email" name="email"
    class:invalid={!isFieldValid('email')} />
    {#if $state.errors['email']}
      <div>
        {#each $state.errors['email'] as error}
          <div>{error.message}</div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="form-field">
    <label class="form-field" class:invalid={!isFieldValid('singlecheckbox')}>
      <input bind:checked={data.singlecheckbox} type="checkbox" name="singlecheckbox">
      <span>Single Checkbox</span>
    </label>
    <ErrorMessages field="singlecheckbox" />
  </div>

  <div class="form-field">
    <label>Multiple Checkboxes</label>
    <label class="form-item">
      <input bind:group={data.multiplecheckboxes} type="checkbox" name="multiplecheckboxes" value="checkbox1">
      <span>Checkbox 1</span>
    </label>
    <label class="form-item">
      <input bind:group={data.multiplecheckboxes} type="checkbox" name="multiplecheckboxes" value="checkbox2">
      <span>Checkbox 2</span>
    </label>
    <label class="form-item">
      <input bind:group={data.multiplecheckboxes} type="checkbox" name="multiplecheckboxes" value="checkbox3">
      <span>Checkbox 3</span>
    </label>
    <ErrorMessages field="multiplecheckboxes" />
  </div>

  <div class="form-field">
    <label>Radios</label>
    <label class="form-item">
      <input bind:group={data.radios} type="radio" name="radios" value="radio1">
      <span>Radio 1</span>
    </label>
    <label class="form-item">
      <input bind:group={data.radios} type="radio" name="radios" value="radio2">
      <span>Radio 2</span>
    </label>
    <label class="form-item">
      <input bind:group={data.radios} type="radio" name="radios" value="radio3">
      <span>Radio 3</span>
    </label>
    <ErrorMessages field="radios" />
  </div>

  <div class="form-field">
    <label>Single Select</label>
    <select bind:value={data.singleselect} name="singleselect" required>
      <option value="">Select...</option>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </select>
    <ErrorMessages field="singleselect" />
  </div>

  <div class="form-field">
    <label>Multiple Select</label>
    <select bind:value={data.multipleselect} name="multipleselect" multiple>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </select>
    <ErrorMessages field="multipleselect" />
  </div>

  <pre class="form-field">data: {JSON.stringify(data, null, 2)}</pre>
  <pre class="form-field">state: {JSON.stringify($state, null, 2)}</pre>

  <input type="submit" value="input submit" disabled={!isFormValid}>
  <button type="submit">Submit Button</button>
  <input type="reset" value="input reset">
</form>

<style>
  form {
    padding: 0 20px;
  }

  .form-field {
    margin: 20px 0;
  }

  .form-item {
    display: block;
  }
</style>
