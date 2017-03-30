import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

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

ReactDOM.render(<Example />, document.getElementById('root'))
