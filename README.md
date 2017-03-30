# informative

React forms with a similar API to [redux-form](http://redux-form.com/) but without redux.

## Install

```sh
npm install --save informative
```

## Examples

There are several examples you can run after cloning the repo. To run each one just type this command and follow the prompts:

```sh
npm run examples
```

Navigate to [localhost:3030](http://localhost:3030) to view the example. Currently there are examples for:

- [Basic Usage](examples/basic-usage/index.js)
- [Basic State Access](examples/basic-state-access/index.js)
- [Submit Handling](examples/submit-handling/index.js)
- [Validation](examples/validation/index.js)
- [Initial Values](examples/initial-values/index.js)
- [Reset Form](examples/reset-form/index.js)
- [Field Wraps](examples/field-wraps/index.js)


## Basic Usage

Let's start by creating a basic login form. The `Form` component is your main entry-point to the API. It will create an HTML form and in this case, two `input` fields for email and password:

```jsx
import React from 'react'
import { Form, Field } from 'informative'

const LoginForm = props => (
  <Form>
    <Field name="email" component="input" type="email" />
    <Field name="password" component="input" type="password" />
    <button type="submit">Submit</button>
  </Form>
)
```

The `Field` component is used to bootstrap state into the `Form` component. It always requires a `name` prop which must be unique for this specific form. To designate what type of field will be created, pass a `component` prop with a string value for `input`, `textarea`, or `select`. If `input` is passed, you can also pass a `type` to get the desired HTML input type.

The above usage of `Form` and `Field` will create a simple form like this:

```html
<form>
  <input type="email" name="email" />
  <input type="password" name="password" />
</form>
```

At this point, the form will behave as expected for an HTML form regarding submission and validation (no validation at this time).


## Basic State Access

By passing a string value for the `component` prop, the API will build our `<input />` field for us. But that doesn't give us access to the field's state or the form's state.

As an alternative, we can pass a custom component into the `component` prop:

```jsx
const Input = props => {
  const { name, type, input, fieldState, formState } = props

  // Access to field and form state
  console.log('Field State', fieldState)
  console.log('Form State State', formState)

  return <input name={name} type={type} {...input} />
}

const Example = props => (
  <Form>
    <Field name="email" component={Input} type="email" />
  </Form>
)
```

By providing the component `Input` instead of a string, we will gain access to props like `fieldState` and `formState` (documented later in this document). `Input` is now expected to return a valid HTML form element of your choice (it doesn't have to be `<input />`). Just be sure to spread the `input` prop into your element to ensure the correct event callbacks are applied.

> Note: You may need to configure babel to understand JSX spread.


## Submit Handling

To provide custom submit handling, pass an `onSubmit` callback prop into `Form`. The `onSubmit` callback gets called when the form is submitted and passes the form's `values` and `formState` into the callback.

```jsx
class LoginForm extends React.Component {

  onSubmit(values, formState) {
    console.log('Values', values)
    console.log('Form State', formState)

    // Always return a promise to let the API know the status
    // of your submission.
    return Promise.resolve()
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Field name="email" component="input" type="email"/><br />
        <Field name="password" component="input" type="password" /><br />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}
```

Note that your submit handler callback will not be called if the form is invalid based on your validation rules. Validation and rules are discussed later in this document.

`onSubmit` is expected to return a promise. This will tell the API whether any asynchronous operations were successful or not. When a rejected promise is returned to the API, the `formState.submitFailed` flag is turned to `true`. To see more about how state is handled in the API, see `formState` below.


## Validation

To provide custom validation, pass a `validate` callback prop into `Form`. The `validate` callback gets called with every value change of any field. It receives the form's values as an argument and is expected to return an error object with each field's name as a property and a value that corresponds to the error. Note that only fields that have errors should be returned in the error object.

```jsx
class LoginForm extends React.Component {

  validate(values) {
    const errors = {}
    if (!/^[\w\d\.]+@[\w\d]+\.[\w]{2,9}$/.test(values.email)) errors.email = 'Invalid Email'
    if (!/^[\w\d]{6,20}$/.test(values.password)) errors.password = 'Invalid Password'
    return errors
  }

  render() {
    return (
      <Form validate={this.validate}>
        <Field name="email" component={Input} /><br />
        <Field name="password" component={Input} type="password" /><br />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}
```

There are much more elegant ways of writing validation such that you wouldn't have to re-write rules for every form, but this example shows a basic strategy for filling an error object with errors for email and password:

```json
{ "email": "Invalid Email", "password": "Invalid Password" }
```

You each field in the error object, you can return a string if you wish, or you can return any other value. Your returned error object represents you notion of errors and the API will give you the same values back in any place where `fieldState` or `formState` is returned.


## Top-Level Access to `formState`

Sometimes it's nice to know what the `formState` is at the top-level of the API. For instance, what if we want to disable the submit button based on whether the form is valid or if the form is in the middle of a long submit?

The `Form` component allows us to pass a callback function as its first child:

```jsx
class LoginForm extends React.Component {

  validate(values) {
    const errors = {}
    if (!/^[\w\d\.]+@[\w\d]+\.[\w]{2,9}$/.test(values.email)) errors.email = 'Invalid Email'
    if (!/^[\w\d]{6,20}$/.test(values.password)) errors.password = 'Invalid Password'
    return errors
  }

  render() {
    return (
      <Form validate={this.validate}>
        {(formProps, formState) => (
          <form {...formProps}>
            <Field name="email" component={Input} /><br />
            <Field name="password" component={Input} type="password" /><br />
            <button type="submit" disabled={!formState.validForm || formState.submitting}>Submit</button>
          </form>
        )}
      </Form>
    )
  }
}
```

The only catch is that we now need to return a `<form>` element since using the API this way won't provide it for us. The callback parameters provides us with `formProps` which is required to spread over the `<form>` for events required by the API. The callback also provides `formState` which is the primary reason to use this pattern -- to have state access at the form level.

Note that we could have also used the `formState` parameter to put error messages next to each field. But this document will show a better way to do that later in the **Field Wraps** section.


## Initial Values

The `Form` component can also take a prop for `initialValues`. This is a simple object with keys that match the names of the fields. This "Edit User" example shows how a form might be filled based on an asynchronous callback:

```jsx
class EditUser extends React.Component {

  constructor() {
    super()
    this.state = {
      initialValues: {}
    }
  }

  componentWillMount() {
    // Simulate network latency for asynchronous `initialValues`
    setTimeout(() => {
      this.setState({
        initialValues: { email: 'example@example.com', password: 'abc123' }
      })
    }, 2000)
  }

  render() {
    return (
      <Form initialValues={this.state.initialValues}>
        <Field name="email" component={Input} /><br />
        <Field name="password" type="password" component={Input} /><br />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}
```

## Reset Form

If you wish to reset a form, use `refs` to access the API's internal `resetForm` method like this:

```jsx
class ResetPassword extends React.Component {

  constructor() {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit() {
    // The <Form /> component has a `resetForm` method that you can access via refs
    // This pseudo code is supposed to show how you can do an async action like resetting
    // a password, then you can reset the form if you want
    return Promise.resolve().then(this.refs.myform.resetForm)
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} ref="myform">
        <Field name="password" component={Input} type="password" /><br />
        <Field name="newPassword" component={Input} type="password" /><br />
        <button type="submit">Change Password</button>
      </Form>
    )
  }
}
```


## Field Wraps

Generally speaking, you probably have some sort of consistent wrapping DOM around all your fields. The specifics of yours may differ, but the concept is probably similar to this HTML:

```jsx
<div class="field-wrap">
  <label>Email</label>
  <div class="input">
    <Field name="email" component={Input} type="email" />
  </div>
</div>
<div class="field-wrap">
  <label>Password</label>
  <div class="input">
    <Field name="password" component={Input} type="password"/>
  </div>
</div>
```

To achieve this without repeating the same HTML structure by hard-coding it for each `Field`, create a custom version of `Field` like this:

```jsx
const FieldWrap = props => {
  const { label, type, ...rest } = props

  return (
    <Field {...rest}>
      {(input, fieldState, formState) => (
        <div className="field-wrap">
          <label>{label}</label>
          <div className="input">
            <input {...input} type={type} />
          </div>
        </div>
      )}
    </Field>
  )
}
```

This is an alternative (and more powerful way) to use `Field`. Notice that we are not passing in a `component` prop to `Field`, but rather a function as a child component. When `Field` is rendered, it will check for this child function and will use its returned value for what gets sent to the form. This essentially gives us the ability to have a "Field Wrap" component which is re-usable.

The above `FieldWrap` component could be used like this:

```jsx
const LoginForm = props => (
  <Form>
    <FieldWrap label="Email" name="email" type="email" />
    <FieldWrap label="Password" name="password" type="password" />
  </Form>
)
```

You may have also noticed that by making a `FieldWrap` component that we have easy access to `fieldState` and `formState` in just the right place to use these values to make things like error messages.

Also notice that through the `...rest` object we are still passing the required `name` to `Field`.


### Field Wrap with custom elements

The above example allows us to have a "Field Wrap" concept, but it always produces an `input` element. What we really want is for `FieldWrap` to be unaware of the actual input field it is rendering. We can use a similar strategy that `Field` uses when it's not being wrapped - that is to pass a component as a prop into `FieldWrap`:

```jsx
const Input = props => {
  const { name, type, input } = props
  return <input type={type || 'text'} id={`field-` + name} name={name} {...input} />
}

const FieldWrap = props => {
  const { label, type, name, component: Component } = props

  return (
    <Field name={name}>
      {(input, fieldState, formState) => (
        <div className="field-wrap">
          <label htmlFor={`field-` + name}>{label}</label>
          <div className="input">
            <Component input={input} name={name} type={type} />
          </div>
          <div className="error">
            {fieldState.error}
          </div>
        </div>
      )}
    </Field>
  )
}

const LoginForm = props => (
  <Form>
    <FieldWrap label="Email" name="email" component={Input} />
    <FieldWrap label="Password" name="password" component={Input} type="password" />
    <button type="submit">Submit</button>
  </Form>
)
```

With `Input` as a component and now abstracted away from `FieldWrap`, you can probably imagine making similar components for `Select`, `Textarea`, and more.

Also note that the above example shows how field errors can be abstracted into a "Field Wrap" concept so the usage of the API is clean and simple at the top `<Form>` level.


## Field Abstractions

Further abstraction can be done by making specific types of fields for quick use. For example, imaging having a `<FieldFirstName />` component which provides the same result as `<FieldWrap label="First Name" name="firstName" component={Input} />`.

With our new `FieldWrap` component, we can now make easy field abstractions for common fields:

```jsx
const FieldEmail = props => <FieldWrap label="Email" name="email" component={Input} type="email" {...props} />
const FieldFirstName = props => <FieldWrap label="First Name" name="firstName" component={Input} {...props} />
const FieldLastName = props => <FieldWrap label="Last Name" name="lastName" component={Input} {...props} />
```

To be used like this:

```jsx
const SignupForm = props => (
  <Form>
    <FieldEmail />
    <FieldEmail label="Repeat Email" name="repeatEmail" />
    <FieldFirstName />
    <FieldLastName />
  </Form>
)
```

We can even override defaults by still passing in props for `label` and `name`.

























## `fieldState`

_todo_


## `formState`

_todo_
