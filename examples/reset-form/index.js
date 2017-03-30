import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

const Input = props => {
  const { name, type, input } = props
  return <input type={type || 'text'} id={`field-` + name} name={name} {...input} />
}

class ResetPassword extends React.Component {

  constructor() {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit() {
    // The <Form /> component has a `resetForm` method that you can access via refs
    // This pseudo code is supposed to show how you can do an async action like resetting
    // a password, then you can reset the form if you want
    return Promise.resolve().then(this.refs.myform.resetForm)
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} ref="myform">
        <Field name="password" component={Input} type="password" /><br />
        <Field name="newPassword" component={Input} type="password" /><br />
        <button type="submit">Change Password</button>
      </Form>
    )
  }
}

ReactDOM.render(<ResetPassword />, document.getElementById('root'))
