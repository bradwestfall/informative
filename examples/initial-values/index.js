import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

const TextField = props => {
  const { name, type, input } = props
  return <input type={type || 'text'} id={`field-` + name} name={name} {...input} />
}

class EditUser extends React.Component {

  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
    // Simulate network latency for asynchronous `initialValues`
    setTimeout(() => {
      this.setState({
        email: 'example@example.com',
        password: 'abc123'
      })
    }, 500)
  }

  render() {
    return (
      <Form>
        <Field name="email" component={TextField} value={this.state.email}/><br />
        <Field name="password" type="password" component={TextField} value={this.state.password}/><br />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<EditUser />, document.getElementById('root'))
