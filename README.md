# Forms

Todo's

- We need to have an ability to pass an onChange into the `<Form>` which gets called after validation and has the form's state in the callback. This will help solve features like:
  - Handle debounced save on any form field change
- Need to make an ability for fields to have multiple/custom values
- We currently update submission state just before we call the user's submit callback, we then pass the state into the callback, but to the user there is no obvious way that this is the first-submit, this might be useful to have
