import React from 'react'

// http://stackoverflow.com/a/5344074
const clone = obj => JSON.parse(JSON.stringify(obj))

const initialFieldState = {
  value: '',
  error: '',
  validField: true,
  dirty: false,
  visited: false,
  active: false
}

class Form extends React.Component {

  constructor() {
    super()
    this.state = {
      hasSubmitted: false,
      submitFailed: false,
      submitting: false,
      validForm: true,
      errors: {},
      fields: {},
      values: {}
    }
    this.registerField = this.registerField.bind(this)
    this.getFormState = this.getFormState.bind(this)
    this.setFieldState = this.setFieldState.bind(this)
    this.validate = this.validate.bind(this)
    this.submitFailed = this.submitFailed.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  getChildContext() {
    return {
      registerField: this.registerField,
      getFormState: this.getFormState,
      setFieldState: this.setFieldState
    }
  }

  registerField(name) {
    this.setState(prevState => {
      let newState = clone(prevState)
      newState.fields[name] = initialFieldState

      // Get initial value if supplied
      const initialValue = (this.props.initialValues && this.props.initialValues[name]) || ''

      // Validate field
      newState = this.validate(name, initialValue, newState)
      newState.fields[name].value = initialValue

      return newState
    })

  }

  getFormState() {
    return this.state
  }

  setFieldState(name, state) {
    let newState = {}

    // If the state change included a value change
    newState = state.value
      ? this.validate(name, state.value, this.state)  // Create state from validation
      : { fields: clone(this.state.fields) }          // Create state from existing

    // Apply new state
    newState.fields[name] = Object.assign(newState.fields[name], state)

    this.setState(newState)
  }

  validate(name, value, existingState) {
    if (!this.props.validate) return existingState

    // Make form values with the new value applied
    const formValues = Object.assign({}, existingState.values, {[name]: value})

    // Determine Errors for entire form based on new change
    const errors = clone(this.props.validate(formValues) || {})
    const validForm = !Object.keys(errors).length

    // Validation returns this new state
    const newState = { validForm, errors, values: formValues, fields: clone(existingState.fields) }

    // Iterate all existing fields and change their `error` message and `validField`
    for (let name in newState.fields) {
      newState.fields[name].error = errors[name] || ''
      newState.fields[name].validField = !newState.fields[name].error
    }

    return newState
  }

  submitFailed() {
    this.setState({ submitting: false, submitFailed: true })
  }

  onSubmit(e) {
    const { validForm, values } = this.state
    if (!validForm || this.props.onSubmit) e.preventDefault()

    this.setState({ submitting: true, submitFailed: validForm, hasSubmitted: true }, () => {
      if (!validForm) {
        this.submitFailed()
        return false
      }
      if (this.props.onSubmit) {
        this.props.onSubmit(values, this.state)
          .then(() => this.setState({ submitting: false }))
          .catch(this.submitFailed)
      }
    })
  }

  render() {
    const props = {
      onSubmit: this.onSubmit
    }

    return typeof this.props.children === 'function'
      ? this.props.children(props, this.state)
      : <form {...props}>{this.props.children}</form>
  }
}

Form.childContextTypes = {
  registerField: React.PropTypes.func,
  getFormState: React.PropTypes.func,
  setFieldState: React.PropTypes.func
}

Form.propTypes = {
  onSubmit: React.PropTypes.func,
  validate: React.PropTypes.func,
  initialValues: React.PropTypes.object
}

export default Form
