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
  const { label, ...rest } = props

  return (
    <Field {...rest}>
      {(inputProps, fieldState, formState) => (
        <div className="field-wrap">
          <label>{label}</label>
          <div className="input">
            <input {...inputProps} />
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
