# forms

## Install

```sh
npm install --save [tbd]
```

## Basic Usage

Let's start by creating a basic login form. The `Form` component is your main entry-point to the API. It will create an HTML form and in this case, two input fields for email and password:

```jsx
import React from 'react'
import { Form, Field } from [tbd]

const LoginForm = props => (
  <Form>
    <Field name="email" component="input" />
    <Field name="password" component="input" type="password" />
  </Form>
)
```

The `Field` component is used to bootstrap state to the `Form` component. It always requires a `name` prop which is unique for the form. To designate what type of field will be created, pass a `component` prop with a string value for `input`, `textarea`, or `select`. If `input` is passed, you can also pass a `type` to get the desired HTML input type.

## Field Wraps

Generally speaking, you probably have some sort of consistent wrapping DOM around all your input fields that might resemble this:

```html
<div class="field-wrap">
  <label>{label}</label>
  <div class="input">
    <input type="text">
  </div>
</div>
```

To achieve this without repeating the same HTML, create a custom version of `Field` like this:

```jsx
const FieldWrap = props => {
  const { label, type, ...rest } = props

  return (
    <Field {...rest}>
      {(inputProps, fieldState, formState) => (
        <div className="field-wrap">
          <label>{label}</label>
          <div className="input">
            <input {...inputProps} type={type} />
          </div>
        </div>
      )}
    </Field>
  )
}
```

In this case, our `FieldWrap` is returning `Field` and we're passing a function into `Field` to define the contents of our field-wrap logic. This component can be used as follows:

```jsx
const LoginForm = props => (
  <Form>
    <FieldWrap label="Email" name="email" />
    <FieldWrap label="Password" name="password" type="password" />
  </Form>
)
```

Notice that the callback we pass to `Field` will get three values `inputProps`, `fieldState`, and `formState`

`inputProps` are important because you need to spread those on the input field. This object contains event handlers and other important information for our input field. Then as you can imagine, `fieldState` contains various details about the field and `formState` has details about the overall form. State is documented later in this file.

Also notice that through the `...rest` object, we are still passing the required `name` to `Field`


## Field Abstractions

With our new `FieldWrap` component, we can now make easy field abstractions for common fields:

```jsx
const FieldEmail = props => <FieldWrap label="Email" name="email" {...props} />
const FieldFirstName = props => <FieldWrap label="FirstName" name="firstName" {...props} />
const FieldLastName = props => <FieldWrap label="LastName" name="lastName" {...props} />
```

To be used like this:

```jsx
const SignupForm = props => (
  <Form>
    <FieldEmail />
    <FieldEmail label="repeatEmail" name="repeatEmail" />
    <FieldFirstName />
    <FieldLastName />
  </Form>
)
```

## Validation and Submit Handling

The `Form` component can also take props for `validate` and `onSubmit`.

The `validate` callback gets called with every value change of any field. It receives the form's values as an argument and is expected to return an object of errors with the name of the field as the respective property of the return object:

```jsx
class LoginForm extends React.Component {
  validate(values) {
    const errors = {}
    if (!/^[\w\d\.]+@[\w\d]+\.[\w]{2,9}$/.test(values.email)) errors.email = "Invalid Email"
    if (!/^[\w\d]{6,20}$/.test(values.password)) errors.password = "Invalid Password"
    return errors
  }

  render() {
    return (
      <Form validate={this.validate}>
        <FieldEmail />
        <FieldPassword />
      </Form>
    )
  }
}
```

There are much more elegant ways of writing validation such that you wouldn't have to re-write rules for every form, but this shows the basic point that if the `email` and `password` fields are not valid, then we will return:

```json
{ "email": "Invalid Email", "password": "Invalid Password" }
```

The `onSubmit` prop works similarly to `validate`:

```jsx
class LoginForm extends React.Component {
  validate(values) {
    const errors = {}
    if (!/^[\w\d\.]+@[\w\d]+\.[\w]{2,9}$/.test(values.email)) errors.email = "Invalid Email"
    if (!/^[\w\d]{6,20}$/.test(values.password)) errors.password = "Invalid Password"
    return errors
  }

  onSubmit(values, formState) {
    return axios.post('somepath/', values)
  }

  render() {
    return (
      <Form validate={this.validate} onSubmit={this.onSubmit}>
        <FieldEmail />
        <FieldPassword />
      </Form>
    )
  }
}
```

However, `onSubmit` is expected to return a promise. In this case we're using the XHR promise library [axios](https://github.com/mzabriskie/axios), but you can do anything you want with the values, as long as a promise is returned.


## `fieldState`

_todo_


## `formState`

_todo_
