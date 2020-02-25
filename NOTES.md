* Look into the svelte use action directive.
* Since a form may have preventDefault, can we hook into the submit handler or
    do we need to provide an 'onSubmit' callback option?
* Could we use indicative submit handler to act as a validate handler that
    returns a validated event. Then on the form element something like
    on:validated can be used to trigger any custom submit handlers.

References
* https://medium.com/better-programming/practical-svelte-the-use-directive-60635671335f
