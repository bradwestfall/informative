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
      visited: false,
      dirty: false,
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

  componentWillMount() {
    console.log('will mount')
    this._earlyInitialValues = this.props.initialValues
  }

  componentWillReceiveProps(nextProps) {
    console.log('will receive props')
    this._earlyInitialValues = nextProps.initialValues
    this.registerInitialValues(nextProps.initialValues)
  }

  registerInitialValues(initialValues) {
    this.setState(prevState => {
      const newState = clone(prevState)

      for (let name in newState.fields) {
        let value = String(initialValues[name])
        newState.fields[name].value = value
        newState.values[name] = value
      }

      newState.errors = clone(this.props.validate(newState.values) || {})
      newState.validForm = !Object.keys(newState.errors).length

      for (let name in newState.fields) {
        newState.fields[name].error = newState.errors[name] || ''
        newState.fields[name].validField = !newState.fields[name].error
      }

      return newState
    })
  }

  setFieldValue(name, value, state) {
    state.fields[name].value = value
    state.values[name] = value
    state.errors = clone(this.props.validate(state.values) || {})
    state.validForm = !Object.keys(state.errors).length
    state.fields[name].error = state.errors[name] || ''
    state.fields[name].validField = !state.fields[name].error
    return state
  }

  registerField(name) {
    this.setState(prevState => {
      let newState = clone(prevState)
      newState.fields[name] = initialFieldState

      if (this._earlyInitialValues && this._earlyInitialValues[name]) {
        newState = this.setFieldValue(name, String(this._earlyInitialValues[name]), newState)
      }

      return newState
    })
  }

  getFormState() {
    return this.state
  }

  setFieldState(name, state) {
    let newState = clone(this.state)

    // Apply new state
    newState.fields[name] = Object.assign(newState.fields[name], state)

    // Apply visited to form also
    if (state.visited) newState.visited = true

    // When the value has changed
    if (state.value) {
      newState.values[name] = state.value
      newState.dirty = true

      // Call to validate replaces state with new state
      newState = this.validate(name, newState)
    }

    this.setState(newState)
  }

  validate(name, state) {
    if (!this.props.validate) return state

    const newState = clone(state)
    newState.errors = clone(this.props.validate(state.values) || {})
    newState.validForm = !Object.keys(newState.errors).length

    // Iterate all existing fields and change their `error` message and `validField`
    for (let name in newState.fields) {
      newState.fields[name].error = newState.errors[name] || ''
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
