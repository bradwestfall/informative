import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

const RegistrationForm = props => (
  <Form>
    <p>This form is really, truely "basic". It's simply the API's version of an HTML form that submits using HTML submissions with no JavaScript interuption</p>
    <Field name="email" component="input" type="email" /><br />
    <Field name="password" component="input" type="password" /><br />
    <Field name="state" component="select">
      <option>az</option>
      <option>ca</option>
    </Field><br />
    <Field name="gender" component="input" type="radio" value="male" />
    <Field name="gender" component="input" type="radio" value="female" /><br />
    <Field name="newsletter" component="input" type="checkbox" value="yes" checked /><br />
    <button type="submit">Submit</button>
  </Form>
)

ReactDOM.render(<RegistrationForm />, document.getElementById('root'))
