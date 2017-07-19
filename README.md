# informative

React forms with a similar API to [redux-form](http://redux-form.com/) but without redux.


## Install

```sh
npm install --save informative
```


## Contents

- [`formState`](#formstate)
- [`fieldState`](#fieldstate)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Basic State Access](#basic-state-access)
  - [Submit Handling](#submit-handling)
  - [Redirects](#redirects)
  - [Validation](#validation)
  - [Top Level Access to `formState`](#top-level-access-to-formstate)
  - [Initial Values](#initial-values)
  - [Reset Form](#reset-form)
  - [Field Wraps](#field-wraps)
    - [Field Wrap with custom elements](#field-wrap-with-custom-elements)
  - [Field Abstraction](#field-abstraction)
  - [`onChange` for `<Field>` and `<Form>`](#onchange-for-field-and-form)
  - [`connectField` HoC](#connectfield-hoc)


## `formState`

A primary goal of this API is to provide your form with real-time state changes about the form. The API keeps track of one state object for the entire form with the following properties with these initial values:

```js
formState = {
  hasSubmitted: false,
  submitFailed: false,
  submitting: false,
  validForm: true,
  visited: false,
  dirty: false,
  errors: {},
  fields: {},
  values: {},
  resetForm: function
}
```

Note that the examples below will demonstrate how to gain access to the form's state.


#### hasSubmitted [`boolean: false`]

Has the form been submitted yet? This defaults to `false` and is set to `true` when the form is submitted regardless of the response from the `onSubmit` callback or the response from the `validate` callback. This is set back to `false` after a call to `resetForm()`.

#### submitFailed [`boolean: false`]

Did the form fail submission in it's last attempt? This defaults to `false` and is set to `true` if the user-supplied validation fails or if the promise returned from the `onSubmit` callback is rejected. Once `true`, this value is set to `false` again when the form is submitted and user-supplied validation passes and the returned promise from the `onSubmit` callback is resolved. This is set back to `false` after a call to `resetForm()`.

#### submitting [`boolean: false`]

Is the form in the process of submitting? This defaults to `false` and is set to `true` when the form is submitted and if the user-supplied validation succeeds. This is set back to `false` when the returned promise from the `onSubmit` callback is rejected or resolved. This is set back to `false` after a call to `resetForm()`.

#### validForm [`boolean: true`]

Is the form valid according to the user-supplied validation callback? This defaults to `true` and is set to `false` any time the user-supplied validation callback returns an object with keys (representing errors).

Upon submission, if this value is set to `false` then the user-supplied submit callback will not be called and the form will receive new state reflecting these changes `{ submitting: false, submitFailed: true, hasSubmitted: true }`

#### visited [`boolean: false`]

Have any of the form's fields been visited? This defaults to `false` and is changed to `true` when any field in the form has its `onChange`, `onBlur`, or `onFocus` events fire. This does not get set back to `false`, even after a call to `formReset()`.

#### dirty [`boolean: false`]

Have any of the form's fields been changed? This defaults to `false` and is changed to `true` when any field in the form has its `onChange` event fired. This is set back to `false` after a call to `resetForm()`.

#### errors [`object`]

This is an object that will either be empty when there are no errors, or will be filled with errors as supplied by the return value of the user-supplied validate callback. The presence of keys in this object is what will trigger `validForm` to be `false`

#### fields [`object`]

This is an object with one property for each field registered in the form. See more about this object in **fieldState** below.

#### values [`object`]

This is an object with one property for each field registered in the form. The value of each property is the respective value for each field.

#### resetForm() [`function`]

This function can be called to reset the form. Resetting a form will have the effect of resetting these `formState` values:

```js
{ hasSubmitted: false, submitFailed: false, submitting: false, dirty: false }
```

It will also have the effect of resetting each field in `formState.fields` to it's default values (see below in **fieldState**) and setting each field in `formState.values` to have an empty string for its value.


## `fieldState`

Each field's state object is stored in `formState.fields[name]` where `name` is the provided name of each field. There are several instances in this API where `fieldState` and `formState` are provided to you in a callback. You can always derive the `fieldState` by digging into `formState`, but when `fieldState` is provided to you, it's just for convenience.

Each field's respective state has these default values:

```js
fieldState = {
  value: '',
  error: '',
  validField: true,
  visited: false,
  dirty: false,
  active: false,
  touched: false
}
```

#### value [`string: ''`]

This is the field's value which defaults to an empty string. This value is changed in real-time as the user interacts with the field and the field's `onChange` event is fired.

#### error [`string: ''`]

This is the error message or value given to this field by the user-supplied validation response. While the default value is an empty string, validation occurs immediately when the form is loaded which might cause field errors. This value is changed in real-time as the user interacts with the field and the field's onChange event is fired.

#### validField [`boolean: true`]

Is the field valid according to the user-supplied validation callback for the form? This defaults to `true` and is set to `false` any time the user-supplied validation callback returns an object with keys matching a field's name, this value will be changed to `false`.

#### visited [`boolean: false`]

Has this field been visited? This defaults to `false` and is changed to `true` when the field's `onChange`, `onBlur`, or `onFocus` events fire. This is set back to `false` after a call to `resetForm()`.

#### dirty [`boolean: false`]

Has this field been changed? This defaults to `false` and is changed to `true` when the field's `onChange` event is fired. This is set back to `false` after a call to `resetForm()`.

#### active [`boolean: false`]

Is the field active (has focus)? This defaults to `false` and is changed to `true` when the field's `onFocus` event is fired. This is set back to `false` when the field's `onBlur` event is fired or after a call to `resetForm()`.

#### touched [`boolean: false`]

Has the field been visited and then left. In other words, this defaults to `false` and is changed to `true` when the field's `onBlur` event is fired. This is set back to `false` after a call to `resetForm()`.


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
- [Full Featured Example](examples/full-featured/index.js)


## Basic Usage

To create a basic form, use the `Form` component as your main entry-point into the API. It will create an HTML form and in this case, two `input` fields for email and password:

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

At this point, the form will behave as expected for an HTML form regarding submission and validation. In the example, there is no `validate` prop, so no valication would occur. Note that HTML5 form validation will occur unless the `novalidate` attribute is passed into `<form />`.


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

By providing the component `Input` instead of a string, we will gain access to props like `fieldState` and `formState`. `Input` is now expected to return a valid HTML form element of your choice (it doesn't have to be `<input />`). Just be sure to spread the `input` prop into your element to ensure the correct event callbacks are applied.

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

`onSubmit` is expected to return a promise. This will tell the API whether any asynchronous operations were successful or not. When a rejected promise is returned to the API, the formState will reflect these new changes: `{ submitting: false, submitFailed: true }`


## Redirects

If your form needs to redirect after submission, the appropriate way to handle this is to return a promise with the first resolved `.then()` doing the redirect:

```js
onSubmit(values) {
  return someXhrCall.then(() => {
    history.push('/new-page')
  })
}
```

> This example assumes the `history` API from React Router

Since our API for onSubmit is going to handle your return promise and set the form's state based on whether it was resolved or rejected, there could be a potential race condition where `setState` is called after the component has unmounted (causing an error because the redirect unmounted the form). But the API knows how to handle this race condition if you perform the redirect inside the first resolved `then()` before returning the promise from `onSubmit`. This race condition bug fix was implemented on v0.2.3


## Validation

To provide custom validation, pass a `validate` callback prop into `Form`. The `validate` callback gets called with every value change of any field along with `formState` for reference. It receives the form's values as an argument and is expected to return an error object with each field's name as a property and a value that corresponds to the error. Note that only fields that have errors should be returned in the error object.

```jsx
class LoginForm extends React.Component {

  validate(values, formState) {
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

There are much more elegant ways of writing validation such that you wouldn't have to re-write rules for every form, but this example shows a proof-of-concept for filling an error object with errors for email and password:

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


## `onChange` for `<Field>` and `<Form>`

Sometimes you'll want real-time state updates as the user types. This can be useful for debounced saves and all kinds of other use cases. By passing an `onChange` into `Field`, the API will call your callback function with the DOM event and the new `formState`.

```jsx
<Field name="email" input="input" onChange={(event, formState) => { ... }} />
```

You can also pass an `onChange` callback into `Form`. The `Form`'s version receives the `name` of the field that was changed followed by the `formState`.

```jsx
<Form onChange={(name, formState) => { ... }} />
```

The `Field`'s `onChange` will be called first before the `Form`'s `onChange`.


## `connectField` HoC

If you'd rather use a higher order component to create a "Field Wrap" concept instead of using `<Field>` with a callback child, the `connectField` can be used like this:

```jsx
import { Form, connectField } from 'informative'

const Input = props => {
  const { name, type, input } = props
  return <input type={type || 'text'} id={`field-` + name} name={name} {...input} />
}

const FieldWrap = props => {
  const { input, fieldState, formState, label, type, name } = props

  // Access to field and form state
  console.log('Field State', fieldState)
  console.log('Form State State', formState)

  return (
    <div className="field-wrap">
      <label htmlFor={`field-` + name}>{label}</label>
      <div className="input">
        <Input input={input} name={name} type={type} />
      </div>
      <div className="error">
        {fieldState.error}
      </div>
    </div>
  )
}

// High-level abstraction fields created with `connectField` HoC
const FieldEmail = connectField('email')(FieldWrap)
const FieldPassword = connectField('password')(FieldWrap)

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
        <FieldEmail label="Email" />
        <FieldPassword label="Password" name="password" type="password" />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}
```
