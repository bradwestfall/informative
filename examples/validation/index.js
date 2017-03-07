import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

class Example extends React.Component {

  validate(values) {
    const errors = {}
    if (values.email !== 'brad@azpixels.com') errors.email = "Invalid Email"
    if (values.password !== 'abc123') errors.password = "Invalid Password"
    return errors
  }

  render() {
    return (
      <Form validate={this.validate}>
        {(props, formState) => (
          <form {...props}>
            <Field name="email" component="input" /> {formState.errors.email}
            <br />
            <Field name="password" component="input" type="password" /> {formState.errors.password}
          </form>
        )}
      </Form>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
