import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

const InputField = props => {
  const { name, type, events, fieldState, formState } = props

  // Access to field and form state
  console.log('Field State', fieldState)
  console.log('Form State State', formState)

  return <input name={name} type={type} {...events} />
}

const Example = props => (
  <Form>
    <Field name="email" component={InputField} type="email" />
  </Form>
)

ReactDOM.render(<Example />, document.getElementById('root'))
