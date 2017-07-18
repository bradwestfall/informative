import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

const TextField = props => {
  const { name, type, input, fieldState, formState } = props

  // Access to field and form state
  console.log('Field State', fieldState)
  console.log('Form State State', formState)

  return <input name={name} type={type} {...input} />
}

class LoginForm extends React.Component {

  validate(values) {
    const errors = {}
    if (!/^[\w\d\.]+@[\w\d]+\.[\w]{2,9}$/.test(values.email)) errors.email = 'Invalid Email'
    return errors
  }

  render() {

    // The password field was left out of this example on purpose to limit
    // the amount of console logs for state changes.

    return (
      <Form validate={this.validate}>
        <Field name="email" component={TextField} /><br />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<LoginForm />, document.getElementById('root'))
