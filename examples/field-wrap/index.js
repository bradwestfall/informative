import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

const Input = props => {
  const { name, type, ...rest} = props
  return <input type={type || 'text'} id={`field-` + name} name={name} {...rest} />
}

const FieldWrap = props => {
  const { label, type, name, component: Component, ...rest } = props

  return (
    <Field {...rest}>
      {(inputProps, fieldState, formState) => (
        <div className="field-wrap">
          <label htmlFor={`field-` + name}>{label}</label>
          <div className="input">
            <Component {...inputProps} name={name} type={type} />
          </div>
          <div className="error">
            {fieldState.error}
          </div>
        </div>
      )}
    </Field>
  )
}

class Example extends React.Component {

  validate(values) {
    const errors = {}
    if (!/^[\w\d\.]+@[\w\d]+\.[\w]{2,9}$/.test(values.email)) errors.email = "Invalid Email"
    if (!/^[\w\d]{6,20}$/.test(values.password)) errors.password = "Invalid Password"
    return errors
  }

  onSubmit(values) {
    console.log('Submit Values', values)
    return Promise.resolve()
  }

  render() {
    const initialValues = { email: 'example@example.com', password: 'abc123' }

    return (
      <Form validate={this.validate} onSubmit={this.onSubmit} initialValues={initialValues}>
        <FieldWrap label="Email" name="email" component={Input} />
        <FieldWrap label="Password" name="password" type="password" component={Input} />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
