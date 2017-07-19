# informative

Forms with internal state-management


## Install

```sh
npm install --save informative
```


## Contents

- [`<Form>` and `<Field>`](#form-and-field)
  - [`<Field component="input" />`](#)
  - [`<Field component="select" />`](#)
  - [`<Field component="textarea" />`](#)
  - [Built-in Fields](#built-in-fields)
  - [Custom Fields](#custom-fields)
  - [`onChange` for `<Field>` and `<Form>`](#onchange-for-field-and-form)
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
  - [Field Abstraction](#field-abstraction)
  - [`connectField` HoC](#connectfield-hoc)
- [`formState`](#formstate)
- [`fieldState`](#fieldstate)




# `<Form>` and `<Field>`

`<Form>` and `<Field>` are the basic building blocks of the API. Always use the `<Form>` component to start an informative form as it is the main entry-point into the API.

The `<Field>` component is used to register each field in your form with the API. It also bootstraps state into the `Form` component. It always requires a `name` prop which must be unique for this specific form unless using radio buttons (in which the names should be the same). To designate what type of field will be created, pass a `component` prop. The `component` prop can be a string or a custom component. In this example we're showing how to use strings to make basic fields.

```jsx
import React from 'react'
import { Form, Field } from 'informative'

const MyForm = props => (
  <Form>
    <Field name="fullName" component="input" />
    <button type="submit">Submit</button>
  </Form>
)
```


### `<Field component="input" />`

In the previous example `<Field name="fullName" component="input" />` is used to make a DOM element similar to `<input type="text" name="fullName">`. The difference though is that since we're using `<Field>`, the input is wired into the form's state and responds to DOM events like `onChange` and a few others.

When using `<Field>` this way with `component="input"`, a `type` property can also be used to designate other input types similar to ordinary HTML. If no `type` is specified, the default is `text`.

Under the hood, `<Field>` uses `<TextField>` when passing `component="input"` into `<Field>` (as long as the type isn't a radio or checkbox). See more on `<TextField>` below in [Built-in Fields](#built-in-fields).


#### Checkbox Inputs

For checkboxes, be sure to specify a prop for `checked` always, even if the value is false, supply `checked={false}`. Also, checkboxes should always have a `value` prop. When the checkbox is checked, the value in the `value` prop is what is applied to the field in terms of the field's state value. If the checkbox is unchecked, the field's state value will be an empty string.

```jsx
<Field name="active" component="input" type="checkbox" value="yes" checked={false} />
```

Under the hood, `<Field>` uses `<CheckboxField>` when passing `component="input" type="checkbox"` into `<Field>`. See more on `<CheckboxField>` below in [Built-in Fields](#built-in-fields).


#### Radio Inputs

For radios, you do not need to always specify `checked` as you do with checkboxes. However, you always need to specify a `value` prop for each radio in the group. A radio group is two or more radio inputs that share the same `name`. In fact, this is the only type of `<Field>` that can share a `name` with another `<Field>`. The value reported by the field's state will be the value of the respective radio that is checked. If no radio is checked, the value in the field's state will be an empty string.

```jsx
<Field name="color" component="input" type="radio" value="yellow" checked />
<Field name="color" component="input" type="radio" value="blue" />
```

Under the hood, `<Field>` uses `<RadioField>` when passing `component="input" type="radio"` into `<Field>`. See more on `<RadioField>` below in [Built-in Fields](#built-in-fields).


### `<Field component="select" />`

A `<select>` field can be created by using `<Field>` and passing the string "select" as the `component` prop:

```jsx
<Field name="state" component="select" value="az">
  <option>az</option>
  <option>ca</option>
</Field>
```

This is the one case where `<Field>` passes child props

Under the hood, `<Field>` uses `<SelectField>` when passing `component="select"` into `<Field>`. See more on `<SelectField>` below in [Built-in Fields](#built-in-fields).


### `<Field component="textarea" />`

A `<textarea>` field can be created by using `<Field>` and passing the string "textarea" as the `component` prop:

```jsx
<Field name="state" component="textarea" value="Here is the starting text" />
```

Notice that the starting text (if you choose to provide it) is applied using the `value` prop.

Under the hood, `<Field>` uses `<TextareaField>` when passing `component="textarea"` into `<Field>`. See more on `<TextareaField>` below in [Built-in Fields](#built-in-fields).


### Built-in Fields

There are several built-in fields which the API uses internally but can also be used by you. The fields are

- TextField (for <input>'s that aren't radio or checkboxes)
- CheckboxField
- RadioField
- SelectField
- TextareaField

Whereas `<Field>` can be used with a string `component` prop, it can also be passed a custom component that returns a field. For example, both of these fields are the same:

```jsx
<Field name="email" component="input" value="example@example.com" />
<Field name="email" component={TextField} value="example@example.com" />
```

All of the built in fields can be imported from the `informative` module like this:

```js
import { TextField, CheckboxField, RadioField, SelectField, TextareaField } from 'informative'
```


### Custom-Fields

Docs coming soon!



## `onChange` for `<Field>` and `<Form>`

Sometimes you'll want real-time state updates as the user interacts with the form. By passing an `onChange` into `<Field>`, the API will call your callback function whenever there is a change to the field. The arguments provided will be `fieldState`, `formState`, and the DOM event if applicable.

```jsx
<Field name="email" input="input" onChange={(fieldState, formState, event) => { ... }} />
```

You can also pass an `onChange` callback into `<Form>`. The `<Form>`'s version on `onChange` will be provided the `formState`, then the `name` of the field that was changed, then the DOM event (if applicable).

```jsx
<Form onChange={(formState, name, event) => { ... }} />
```

Note that the `<Field>` change will also trigger the a `<Form>` change and the <Field> change will be called first before the `<Form>`'s.



# Examples

There are several examples you can run after cloning the repo. To run each one just type this command and follow the prompts:

```sh
npm run examples
```

Navigate to [localhost:3030](http://localhost:3030) to view the example


## Basic Usage

[See Full Code Example](examples/basic-usage/index.js)

In this example, the most basic usage of `<Form>` and `<Field>` are used. This form will behave just like a normal HTML form that has no submit or validation handlers (In other words, the form will submit to a new page and since there's no action attribute, it will submit to the same page). While there is no JS validation occurring in this example, HTML5 form validation will occur unless the `novalidate` attribute is passed into `<form />` (Note that in React the actual value passed is `noValidate`).

```jsx
import React from 'react'
import { Form, Field } from 'informative'

const RegistrationForm = props => (
  <Form>
    <Field name="email" component="input" type="email" />
    <Field name="password" component="input" type="password" />
    <Field name="state" component="select">
      <option>az</option>
      <option>ca</option>
    </Field>
    <Field name="gender" component="input" type="radio" value="male" />
    <Field name="gender" component="input" type="radio" value="female" />
    <Field name="newsletter" component="input" type="checkbox" value="yes" checked />
    <button type="submit">Submit</button>
  </Form>
)
```

The above example creates an ordinary HTML form like this:

```html
<form>
  <input type="email" name="email" />
  <input type="password" name="password" />
  <select name="state">
    <option>az</option>
    <option>ca</option>
  </select>
  <input type="radio" name="gender" value="male" />
  <input type="radio" name="gender" value="female" />
  <input type="checkbox" name="newsletter" value="yes" checked />
</form>
```


## Basic State Access

[See Full Code Example](examples/basic-state-access/index.js)

As seen in the previous example, by passing a string value for the `component` prop, the API will build our `<input />` field for us. But that doesn't give us access to the field's state or the form's state.

As an alternative, we can pass a custom component into the `component` prop:

```jsx
const TextField = props => {
  const { name, type, events, fieldState, formState } = props

  // Access to field and form state
  console.log('Field State', fieldState)
  console.log('Form State State', formState)

  return <input name={name} type={type} {...events} />
}

const Example = props => (
  <Form>
    <Field name="email" component={TextField} type="email" />
  </Form>
)
```

By providing the component our `TextField` instead of a string, we will gain access to props like `fieldState` and `formState` from within `TextField`. `TextField` is now expected to return a valid HTML form element of your choice (it doesn't have to be `<input />`). Just be sure to spread the `events` prop into your element to ensure the correct event callbacks are applied.

> Note: You may need to configure babel to understand JSX spread.


## Submit Handling

[See Full Code Example](examples/submit-handling/index.js)

To provide custom submit handling, pass an `onSubmit` callback prop into `Form`. The `onSubmit` callback gets called when the form is submitted and passes the form's `values` and `formState` to your callback function.

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

`onSubmit` is expected to return a promise. This will tell the API whether any asynchronous operations were successful or not. When a rejected promise is returned to the API, the `formState` will reflect these new changes: `{ submitting: false, submitFailed: true }`


## Redirects

If your form needs to redirect after submission, the appropriate way to handle this is to return a promise with the first resolved `.then()` doing the redirect:

```js
onSubmit(values) {
  return someNetworkRequest.then(() => {
    history.push('/new-page')
  })
}
```

> This example assumes the `history` API from React Router.

Since our API for `onSubmit` is going to handle your return promise and set the form's state based on whether it was resolved or rejected, there could be a potential race condition where `setState` is called after the component has unmounted (causing an error because the redirect unmounted the form). But the API knows how to handle this race condition if you perform the redirect inside the first resolved `then()` before returning the promise from `onSubmit`. This race condition bug fix was implemented on v0.2.3


## Validation

[See Full Code Example](examples/validation/index.js)

To provide custom validation, pass a `validate` callback prop into `Form`. The `validate` callback gets called with every value change of any field along with `formState` for reference. It receives the form's values as an argument and is expected to return an error object with each field's name as a property and a value that corresponds to the error. Note that only fields that have errors should be returned in the error object and if there are no errors, an empty object should be returned.

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
        <Field name="email" component="input" /><br />
        <Field name="password" component="input" type="password" /><br />
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

The `Form` component allows us to pass a `render` callback function:

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
      <Form validate={this.validate} render={(formProps, formState) => (
        <form {...formProps}>
          <Field name="email" component={Input} /><br />
          <Field name="password" component={Input} type="password" /><br />
          <button type="submit" disabled={!formState.validForm || formState.submitting}>Submit</button>
        </form>
      )} />
    )
  }
}
```

The only catch is that we now need to return a `<form>` element since using the API this way won't provide it for us. On a side note, if you need to customize the actual DOM `<form>` element beyond what the API builds, this is the way to do that.

The `render` callback is given `formProps` which is required to spread over the `<form>` for events required by the API. The callback is also given `formState` which is the primary reason to use this pattern -- to have state access at the form level.

Note that we could have also used the `formState` parameter to put error messages next to each field. But this document will show a better way to do that later in the **Field Wraps** section.


## Initial Values

[See Full Code Example](examples/initial-values/index.js)

The `<Field>` component can take a `value` prop to provide fields with their initial values:

```jsx
class EditUser extends React.Component {

  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
    // Simulate network latency
    setTimeout(() => {
      this.setState({
        email: 'example@example.com',
        password: 'abc123'
      })
    }, 500)
  }

  render() {
    return (
      <Form>
        <Field name="email" component="input" value={this.state.email}/><br />
        <Field name="password" type="password" component="input" value={this.state.password}/><br />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}
```

Note that while the form does allow late values to be passed into the form (because sometimes values come late from async operations) , `informative` does not work by allowing you to manage your form's state outside the form and then by passing values into fields as they change. All form state is managed internally with callback options to be alerted on state changes (See later in this document).


## Reset Form

[See Full Code Example](examples/reset-form/index.js)

If you wish to reset a form, use `refs` to access the API's internal `resetForm` method like this:

```jsx
class UpdatePassword extends React.Component {
  static _myform

  constructor() {
    super()
    this.resetForm = this.resetForm.bind(this)
  }

  resetForm() {
    // The <Form /> component has a `resetForm` method that you can access via refs
    this._myform.resetForm()
  }

  render() {
    return (
      <Form ref={form => {this._myform = form}} validate={this.validate}>
        <Field name="Name" component="input" value="Brad" /><br />
        <Field name="bio" component="textarea" value="Web Development" /><br />
        <Field name="state" component="select" value="az">
          <option></option>
          <option>az</option>
          <option>ca</option>
        </Field><br />
        <Field name="active" component="input" type="checkbox" value="yes" checked /><br />
        <Field name="gender" component="input" type="radio" value="m" checked />
        <Field name="gender" component="input" type="radio" value="f" /><br />
        <button type="button" onClick={this.resetForm}>Reset</button>
      </Form>
    )
  }
}
```


## Field Wraps

[See Full Code Example](examples/field-wraps/index.js)

Generally speaking, you probably want some sort of consistent wrapping DOM around all your fields. The specifics of yours may differ, but the concept is probably similar to this HTML:

```jsx
<div class="field-wrap">
  <label>Email</label>
  <div class="field">
    <Field name="email" component={Input} type="email" />
  </div>
</div>
<div class="field-wrap">
  <label>Password</label>
  <div class="field">
    <Field name="password" component={Input} type="password"/>
  </div>
</div>
```

To achieve this without repeating the same HTML structure by hard-coding it for each `Field`, create a custom component to use in your forms that wraps around `<Field>`:

```jsx
import React from 'react'
import { Form, Field, TextField } from 'informative'

const FieldWrap = props => {
  const { label, component: Component, children, value, name, ...rest } = props

  return (
    <Field name={name} {...rest} render={(events, fieldState, formState) => {
      return (
        <div className="field-wrap">
          <label htmlFor={`field-${name}`}>{label}</label>
          <div className="field">
            <Component originalValue={value} name={name} fieldState={fieldState} formState={formState} events={events}>
              {children}
            </Component>
          </div>
          <div className="error">
            {fieldState.error}
          </div>
        </div>
      )
    }} />
  )
}

const LoginForm = props => (
  <Form>
    <FieldWrap label="Email" name="email" component={TextField} />
    <FieldWrap label="Password" name="password" component={TextField} type="password" />
    <button type="submit">Submit</button>
  </Form>
)
```

Not only do we get to write the wrapper code and use it everywhere, it has other benefits like how field errors can be emitted inline with the field in the DOM.

You can build your own version of `<FieldWrap>` any way you like. This one is just an example and doesn't come with the API. Notice that this one does make use of the built-in `TextField` component. This example `<FieldWrap>` would allow us to use the build-in `TextField`, `CheckboxField`, `RadioField`, `SelectField`, and `TextareaField` -- all of which require specific props that you can see we're passing into `<Component originalValue={value} name={name} fieldState={fieldState} formState={formState} events={events} />`. Yours though could be built any way you like, just be sure to pass the `events` prop into the actual form field to wire it into the API.

For more docs on the built-in fields, see [Built-in Fields](#built-in-fields) above.


## Field Abstractions

[See Full Code Example](examples/full-featured/index.js)

Further abstraction can be done by making specific types of fields for quick use. For example, imaging having a `<FieldFirstName />` component which provides the same result as `<FieldWrap label="First Name" name="firstName" component={TextField} />`.

With our new `FieldWrap` component, we can now make easy field abstractions for common fields:

```jsx
const FieldFirstName = props => <FieldWrap label="First Name" name="firstName" component={TextField} {...props} />
const FieldLastName = props => <FieldWrap label="Last Name" name="lastName" component={TextField} {...props} />
const FieldEmail = props => <FieldWrap label="Email" name="email" component={TextField} type="email" {...props} />
const FieldPassword = props => <FieldWrap label="Password" name="password" component={TextField} type="password" {...props} />
```

To be used like this:

```jsx
const SignupForm = props => (
  <Form>
    <FieldFirstName />
    <FieldLastName />
    <FieldEmail />
    <FieldEmail label="Repeat Email" name="repeatEmail" />
    <FieldPassword />
  </Form>
)
```

Since we spread the props over `<FieldWrap>`, each custom field can be overridden as we do with the second email in this example


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


# `formState`

A primary goal of this API is to provide your form with real-time form-state changes. The API keeps state in one object for the entire form with the following properties with these initial values:

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
  values: {}
}
```


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


# `fieldState`

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
