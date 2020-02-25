<script>
  // @todo ability to read field params (e.g. required, minlength, etc.)
  import { svelteIndicative } from './components/indicative.js';

  const { state, isValid, validator } = svelteIndicative();

  let indicativeParams = {
    validationSchema: {
      textfield: 'required|alpha|min:4',
      singlecheckbox: 'required',
      multiplecheckboxes: 'required',
      radios: 'required',
      singleselect: 'required',
      multipleselect: 'required'
    },
    messages: {
      required: (field, validation, args) => {
        return `${field} is required.`;
      }
    },
    // @todo
    // sanitizerSchema: {}
  };

  let data = {
    textfield: '',
    checkbox: false,
    multiplecheckboxes: [],
    radios: '',
  };

  $: isFormValid = isValid($state);
  $: isFieldValid = (field) => isValid($state, field);
  $: isValidating = $state.isValidating;

  const onSubmit = (evt) => {
    console.log('onSubmit', evt);
  };

  const onValidated = (results) => {
    console.log('onValidated', results);
  };
</script>

<form
  id="theform"
  use:validator={indicativeParams}
  on:submit|preventDefault={onSubmit}
  on:validated={onValidated}
  class:form-invalid={!isFormValid}>

  <div class="form-field">
    <label>Text Field</label>
    <input id="textfield" type="text" name="textfield"
    class:invalid={!isFieldValid('textfield')} />
  </div>

  <label class="form-field" class:invalid={!isFieldValid('singlecheckbox')}>
    <input type="checkbox" name="singlecheckbox" value="single checkbox">
    <span>Single Checkbox</span>
  </label>

  <div class="form-field">
    <label>Multiple Checkboxes</label>
    <label class="form-item">
      <input type="checkbox" name="multiplecheckboxes" value="checkbox1">
      <span>Checkbox 1</span>
    </label>
    <label class="form-item">
      <input type="checkbox" name="multiplecheckboxes" value="checkbox2">
      <span>Checkbox 2</span>
    </label>
    <label class="form-item">
      <input type="checkbox" name="multiplecheckboxes" value="checkbox3">
      <span>Checkbox 3</span>
    </label>
  </div>

  <div class="form-field">
    <label>Radios</label>
    <label class="form-item">
      <input type="radio" name="radios" value="radio1">
      <span>Radio 1</span>
    </label>
    <label class="form-item">
      <input type="radio" name="radios" value="radio2">
      <span>Radio 2</span>
    </label>
    <label class="form-item">
      <input type="radio" name="radios" value="radio3">
      <span>Radio 3</span>
    </label>
  </div>

  <div class="form-field">
    <label>Single Select</label>
    <select name="singleselect">
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </select>
  </div>

  <div class="form-field">
    <label>Multiple Select</label>
    <select id="multipleselect" name="multipleselect" multiple>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </select>
  </div>

  <div class="form-field">state: {JSON.stringify($state, null, 2)}</div>

  <input type="submit" value="input submit">
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
