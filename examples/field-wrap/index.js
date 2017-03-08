import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

const FieldWrap = props => {
  const { label, ...rest } = props

  return (
    <Field {...rest}>
      {(inputProps, fieldState, formState) => {
        return (
          <div className="field-wrap">
            <label>{label}</label>
            <div className="input">
              <input {...inputProps} />
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

class Example extends React.Component {

  validate(values) {
    const errors = {}
    if (!/^[\w\d\.]+@[\w\d]+\.[\w]{2,9}$/.test(values.email)) errors.email = "Invalid Email"
    if (!/^[\w\d]{6,20}$/.test(values.password)) errors.password = "Invalid Password"
    return errors
  }

  render() {
    const initialValues = { email: 'example@example.com', password: 'abc123' }

    return (
      <Form validate={this.validate} initialValues={initialValues}>
        <FieldWrap label="Email" name="email"  />
        <FieldWrap label="Password" name="password" type="password" />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
