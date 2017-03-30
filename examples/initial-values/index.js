import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

const Input = props => {
  const { name, type, input } = props
  return <input type={type || 'text'} id={`field-` + name} name={name} {...input} />
}

class EditUser extends React.Component {

  constructor() {
    super()
    this.state = {
      initialValues: {}
    }
  }

  componentWillMount() {
    // Simulate network latency for asynchronous `initialValues`
    setTimeout(() => {
      this.setState({
        initialValues: { email: 'example@example.com', password: 'abc123' }
      })
    }, 2000)
  }

  render() {
    return (
      <Form initialValues={this.state.initialValues}>
        <Field name="email" component={Input} /><br />
        <Field name="password" type="password" component={Input} /><br />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<EditUser />, document.getElementById('root'))
