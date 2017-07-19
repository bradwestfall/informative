import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

class UpdatePassword extends React.Component {
  static _myform

  constructor() {
    super()
    this.resetForm = this.resetForm.bind(this)
  }

  resetForm() {
    // The <Form /> component has a `resetForm` method that you can access via refs
    this._myform.resetForm()
  }

  validate(values) {
    const errors = {}
    // Allows us to see values as the user types for testing
    console.log('Validate', values)
    return errors
  }

  render() {
    return (
      <Form ref={form => {this._myform = form}} validate={this.validate}>
        <Field name="Name" component="input" value="Brad" /><br />
        <Field name="bio" component="textarea" value="Web Development" /><br />
        <Field name="state" component="select" value="az">
          <option></option>
          <option>az</option>
          <option>ca</option>
        </Field><br />
        <Field name="active" component="input" type="checkbox" value="yes" checked /><br />
        <Field name="gender" component="input" type="radio" value="m" checked />
        <Field name="gender" component="input" type="radio" value="f" /><br />
        <button type="button" onClick={this.resetForm}>Reset</button>
      </Form>
    )
  }
}

ReactDOM.render(<UpdatePassword />, document.getElementById('root'))
