export function indicative(node, params) {
  console.log('indicative params', params);

  const handleBlur = (evt) => {
    console.log('handleBlur', evt);
  };

  const handleChange = (evt) => {
    console.log('handleChange', evt);
  };

  const handleFocus = (evt) => {
    console.log('handleFocus', evt);
  };

  const handleInput = (evt) => {
    console.log('handleInput', evt);
  };

  const handleInvalid = (evt) => {
    console.log('handleInvalid', evt);
  };

  const handleReset = (evt) => {
    console.log('handleReset', evt);
  };

  const handleSubmit = (evt) => {
    console.log('handleSubmit', evt);
  };

  const handleUpdate = (evt) => {
    console.log('handleUpdate', evt);
  };

  node.addEventListener('onblur', handleBlur);
  node.addEventListener('onchange', handleChange);
  node.addEventListener('onfocus', handleFocus);
  node.addEventListener('oninput', handleInput);
  node.addEventListener('oninvalid', handleInvalid);
  node.addEventListener('onreset', handleReset);
  node.addEventListener('onsubmit', handleSubmit);
  node.addEventListener('onupdate', handleUpdate);

  return {
    update(params) {
      // @todo
      console.log('indicative update params', params);
    },
    destroy() {
      console.log('indicative destroy');

      node.removeEventListener('onblur', handleBlur);
      node.removeEventListener('onchange', handleChange);
      node.removeEventListener('onfocus', handleFocus);
      node.removeEventListener('oninput', handleInput);
      node.removeEventListener('oninvalid', handleInvalid);
      node.removeEventListener('onreset', handleReset);
      node.removeEventListener('onsubmit', handleSubmit);
      node.removeEventListener('onupdate', handleUpdate);
    }
  };
}
