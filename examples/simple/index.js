import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

class Example extends React.Component {
  render() {
    return (
      <Form>
        <Field name="email" component="input" />
        <Field name="password" component="input" />
      </Form>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
