import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

class EditUser extends React.Component {

  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
    // Simulate network latency
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
        <Field name="email" component="input" value={this.state.email}/><br />
        <Field name="password" type="password" component="input" value={this.state.password}/><br />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<EditUser />, document.getElementById('root'))
