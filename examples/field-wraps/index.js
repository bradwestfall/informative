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

        // Access to field and form state
        console.log('Field State', fieldState)
        console.log('Form State State', formState)

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

class LoginForm extends React.Component {

  validate(values) {
    const errors = {}
    if (!/^[\w\d\.]+@[\w\d]+\.[\w]{2,9}$/.test(values.email)) errors.email = 'Invalid Email'
    return errors
  }

  render() {
    return (
      <Form validate={this.validate}>
        <FieldWrap label="Email" name="email" component={Input} />
        <FieldWrap label="Password" name="password" component={Input} type="password" />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<LoginForm />, document.getElementById('root'))
