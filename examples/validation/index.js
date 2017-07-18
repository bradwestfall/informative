import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field, TextField } from 'src'


class LoginForm extends React.Component {

  validate(values) {
    const errors = {}
    if (!/^[\w\d\.]+@[\w\d]+\.[\w]{2,9}$/.test(values.email)) errors.email = 'Invalid Email'
    if (!/^[\w\d]{6,20}$/.test(values.password)) errors.password = 'Invalid Password'
    console.log('Validation Errors', errors)
    return errors
  }

  render() {
    return (
      <Form validate={this.validate}>
        <Field name="email" component={TextField} type="email" /><br />
        <Field name="password" component={TextField} type="password" /><br />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<LoginForm />, document.getElementById('root'))
