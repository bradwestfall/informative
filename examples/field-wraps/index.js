import React from 'react'
import ReactDOM from 'react-dom'
import { Form } from 'src'

const Input = props => {
  const { name, type, ...rest} = props
  return <input type={type || 'text'} id={`field-` + name} name={name} {...rest} />
}

const CustomInput = props => {
  const { input, formState, fieldState, label, name, type } = props;
  return (
    <fieldset>
      <label htmlFor={name}>{label}</label>
      <Input {... input} type={type} />
    </fieldset>
  )
}

class Example extends React.Component {

  validate(values) {
    const errors = {}
    if (!/^[\w\d\.]+@[\w\d]+\.[\w]{2,9}$/.test(values.email)) errors.email = 'Invalid Email'
    if (!/^[\w\d]{6,20}$/.test(values.password)) errors.password = 'Invalid Password'
    return errors
  }

  onSubmit(values) {
    console.log('Submit Values', values)
    return Promise.resolve()
  }

  render() {
    const initialValues = { email: 'example@example.com', password: 'abc123' }
    const Email = connectField("email")(CustomInput);
    const Password = connectField("password")(CustomInput);
    return (
      <Form validate={this.validate} onSubmit={this.onSubmit} initialValues={initialValues}>
        <Email label="Email" name="email" />
        <Password label="Password" name="password" type="password" />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
