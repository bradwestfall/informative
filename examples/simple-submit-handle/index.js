import React from 'react'
import ReactDOM from 'react-dom'
import { Form, Field } from 'src'

class Example extends React.Component {

  onSubmit(values, formState) {

    console.log('Values', values)
    console.log('Form State', formState)

    // Always return a promise to let the API know the status
    // of your submission
    return Promise.resolve()

  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Field name="email" component="input" /><br />
        <Field name="password" component="input" type="password" /><br />
        <button type="submit">Submit</button>
      </Form>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
