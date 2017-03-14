# Todo's

- Form's call to `setState` after form has unmounted issues a warning
- To circumvent HTML form validation, we may need to provide a `noValidate` on the `<form>` when a validation method is passed in. Otherwise our `onSubmit` does not get called
- We need to have an ability to pass an onChange into the `<Form>` which gets called after validation and has the form's state in the callback. This will help solve features like:
  - Handle debounced save on any form field change at the field level and at the form level
- Need to make an ability for fields to have multiple/custom values
- Build other input field types
  - textarea
  - select
  - radio
  - checkbox etc
