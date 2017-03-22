import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

class Example extends React.Component {
  render() {
    return (
      <Form>
        <p>This form is really, truely "basic". It's simply the API's version of a basic HTML form that submits using HTML submissions</p>
        <Field name="email" component="input" /><br />
        <Field name="password" component="input" type="password" /><br />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
