import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field, TextField } from 'src'

const FieldWrap = props => {
  const { label, component: Component, children, value, name, ...rest } = props

  return (
    <Field name={name} {...rest} render={(events, fieldState, formState) => (
        <div className="field-wrap">
          <label htmlFor={`field-${name}`}>{label}</label>
          <div className="field">
            <Component originalValue={value} name={name} fieldState={fieldState} formState={formState} events={events}>
              {children}
            </Component>
          </div>
          <div className="error">
            {fieldState.error}
          </div>
        </div>
    )} />
  )
}

// High-level Field Abstractions
const FieldFirstName = props => <FieldWrap label="First Name" name="firstName" component={TextField} {...props} />
const FieldLastName = props => <FieldWrap label="Last Name" name="lastName" component={TextField} {...props} />
const FieldEmail = props => <FieldWrap label="Email" name="email" component={TextField} type="email" {...props} />
const FieldPassword = props => <FieldWrap label="Password" name="password" component={TextField} type="password" {...props} />

class UserForm extends React.Component {

  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
    // Simulate network latency for asynchronous `initialValues`
    setTimeout(() => {
      this.setState({
        firstName: 'Sally',
        lastName: 'Jane',
        email: 'example@example.com',
        password: 'abc123'
      })
    }, 500)
  }

  validate(values) {
    const errors = {}
    if (!/^[\w\d\.]+@[\w\d]+\.[\w]{2,9}$/.test(values.email)) errors.email = 'Invalid Email'
    if (!/^[\w\d]{6,20}$/.test(values.password)) errors.password = 'Invalid Password'
    return errors
  }

  onSubmit(values, formState) {
    console.log('Submit Form', values)
    return Promise.resolve()
  }

  render() {
    return (
      <Form validate={this.validate} onSubmit={this.onSubmit} render={(formProps, formState) => (
        <form {...formProps} noValidate>
          <FieldFirstName value={this.state.firstName} />
          <FieldLastName value={this.state.lastName} />
          <FieldEmail value={this.state.email} />
          <FieldPassword value={this.state.password} />
          <button type="submit" disabled={!formState.validForm}>Submit</button>
        </form>
      )} />
    )
  }
}

ReactDOM.render(<UserForm />, document.getElementById('root'))
