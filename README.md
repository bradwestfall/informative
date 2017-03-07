# Forms

Todo's

- We should have the ability to pass a function into <Form> to introduce state to <Fields>
- Ability to pass "type" into inputs
- Handle debounced save on any form field change
  - maybe we give an onChange callback on the form or field level
- what if we want a field to have multiple values
  - perhaps in the props we give to <field>, the field can call props.onChange manually and pass back two values
- We now update submission state just before we call the user's callback, we then pass the state into the callback, but to the user there is no obvious way that this is the first-submit, this might be useful to have
