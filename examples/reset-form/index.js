import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

const Input = props => {
  const { name, type, input } = props
  return <input type={type || 'text'} id={`field-` + name} name={name} {...input} />
}

class Example extends React.Component {

  constructor() {
    super()
    this.state = {
      initialValues: { email: 'example@example.com', password: 'abc123' }
    }
    this.resetForm = this.resetForm.bind(this)
  }

  resetForm() {
    // The <Form /> component has a `resetForm` method that you can access via refs
    this.refs.myform.resetForm()
  }

  render() {
    return (
      <div>
        <Form initialValues={this.state.initialValues} ref="myform">
          <Field name="email" component={Input} /><br />
          <Field name="password" type="password" component={Input} /><br />
          <button type="button" onClick={this.resetForm}>Reset</button>
        </Form>
      </div>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
