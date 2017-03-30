import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

const LoginForm = props => (
  <Form>
    <p>This form is really, truely "basic". It's simply the API's version of an HTML form that submits using HTML submissions with no JavaScript interuption</p>
    <Field name="email" component="input" type="email" /><br />
    <Field name="password" component="input" type="password" /><br />
    <button type="submit">Submit</button>
  </Form>
)

ReactDOM.render(<LoginForm />, document.getElementById('root'))
