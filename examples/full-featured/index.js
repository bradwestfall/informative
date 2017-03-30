import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

const Input = props => {
  const { name, type, input } = props
  return <input type={type || 'text'} id={`field-` + name} name={name} {...input} />
}

const FieldWrap = props => {
  const { label, type, name, component: Component, ...rest } = props

  return (
    <Field name={name} {...rest}>
      {(input, fieldState, formState) => {

        return (
          <div className="field-wrap">
            <label htmlFor={`field-` + name}>{label}</label>
            <div className="input">
              <Component input={input} name={name} type={type} />
            </div>
            <div className="error">
              {fieldState.error}
            </div>
          </div>
        )

      }}
    </Field>
  )
}

// High-leve Field Abstractions
const FieldFirstName = props => <FieldWrap label="First Name" name="firstName" component={Input} {...props} />
const FieldLastName = props => <FieldWrap label="Last Name" name="lastName" component={Input} {...props} />
const FieldEmail = props => <FieldWrap label="Email" name="email" component={Input} type="email" {...props} />
const FieldPassword = props => <FieldWrap label="Password" name="password" component={Input} type="password" {...props} />

class UserForm extends React.Component {

  constructor() {
    super()
    this.state = {
      initialValues: {
        firstName: 'Sally',
        lastName: 'Jane',
        email: 'example@example.com',
        password: 'abc123'
      }
    }
  }

  validate(values) {
    const errors = {}
    if (!/^[\w\d\.]+@[\w\d]+\.[\w]{2,9}$/.test(values.email)) errors.email = 'Invalid Email'
    if (!/^[\w\d]{6,20}$/.test(values.password)) errors.password = 'Invalid Password'
    return errors
  }

  onSubmit(values, formState) {
    console.log('Submit Form')
    return Promise.resolve()
  }

  render() {
    return (
      <Form validate={this.validate} onSubmit={this.onSubmit} initialValues={this.state.initialValues}>
        {(formProps, formState) => (
          <form {...formProps}>
            <FieldFirstName />
            <FieldLastName />
            <FieldEmail />
            <FieldPassword />
            <button type="submit" disabled={!formState.validForm}>Submit</button>
          </form>
        )}
      </Form>
    )
  }
}

ReactDOM.render(<UserForm />, document.getElementById('root'))
