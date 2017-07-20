import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field, InputField } from 'src'

const FieldWrap = props => {
  const { label, component: Component, children, name, value, ...rest } = props

  return (
    <Field {...rest} name={name} value={value} render={(events, fieldState, formState) => {

      // Access to field and form state
      console.log('Field State', fieldState)
      console.log('Form State State', formState)

      return (
        <div className="field-wrap">
          <label htmlFor={`field-${name}`}>{label}</label>
          <div className="field">
            <Component name={name} originalValue={value} fieldState={fieldState} formState={formState} events={events}>
              {children}
            </Component>
          </div>
          <div className="error">
            {fieldState.error}
          </div>
        </div>
      )

    }} />
  )
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
        <FieldWrap label="Email" name="email" component={InputField} />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<LoginForm />, document.getElementById('root'))
