import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

class Example extends React.Component {

  validate(values) {
    const errors = {}
    if (!/^[\w\d\.]+@[\w\d]+\.[\w]{2,9}$/.test(values.email)) errors.email = "Invalid Email"
    if (!/^[\w\d]{6,20}$/.test(values.password)) errors.password = "Invalid Password"
    return errors
  }

  render() {
    return (
      <Form validate={this.validate}>
        {(props, formState) => {
          return (
            <form {...props}>
              <Field name="email" component="input" /> {formState.errors.email}
              <br />
              <Field name="password" component="input" type="password" /> {formState.errors.password}
              <br />
              <button type="submit">Submit</button>
            </form>
          )
        }}
      </Form>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
