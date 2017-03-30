import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

class LoginForm extends React.Component {

  onSubmit(values, formState) {
    console.log('Values', values)
    console.log('Form State', formState)

    // Always return a promise to let the API know the status
    // of your submission. Typically you'll probably do some
    // sort of async operation here like a network request, so
    // a resolved promise will tell the API that everything went
    // well or not
    return Promise.resolve()
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Field name="email" component="input" type="email" /><br />
        <Field name="password" component="input" type="password" /><br />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<LoginForm />, document.getElementById('root'))
