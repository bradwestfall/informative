import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

const FieldWrap = props => {
  const { label, type, ...rest } = props

  return (
    <Field {...rest}>
      {(inputProps, fieldState, formState) => (
        <div className="field-wrap">
          <label>{label}</label>
          <div className="input">
            <input {...inputProps} type={type} />
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
        <FieldWrap label="Email" name="email"  />
        <FieldWrap label="Password" name="password" type="password" />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
