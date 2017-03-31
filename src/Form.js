import React from 'react'

// http://stackoverflow.com/a/5344074
const clone = obj => JSON.parse(JSON.stringify(obj))

const initialFieldState = () => ({
  value: '',
  error: '',
  validField: true,
  visited: false,
  dirty: false,
  active: false,
})

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
      values: {},
    }
    this.registerField = this.registerField.bind(this)
    this.setFieldState = this.setFieldState.bind(this)
    this.getFormState = this.getFormState.bind(this)
    this.onChange = this.onChange.bind(this)
    this.validate = this.validate.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.resetForm = this.resetForm.bind(this)
  }

  getChildContext() {
    return {
      registerField: this.registerField,
      setFieldState: this.setFieldState,
      getFormState: this.getFormState,
      onChange: this.onChange
    }
  }

  componentWillMount() {
    // No fields will have been registered at this point. So we're holding onto this
    // value for when `registerField` has been called later on
    if (this.props.initialValues) {
      this._earlyInitialValues = clone(this.props.initialValues)
    }
  }

  componentWillReceiveProps(nextProps) {
    // This is the fastest and most effective way to see if initialValues has changed. A side
    // effect of this technique is that the order of properties matters for this comparison to
    // be true. But if the initialValues was truely unchanged, then so should the order.
    if (!nextProps.initialValues || JSON.stringify(nextProps.initialValues) === JSON.stringify(this._earlyInitialValues)) {
      return false
    }

    // There are some race conditions between receiving new initialValues props with
    // this method and maybe or maybe not having any fields registered yet. Therefore,
    // we will set `_earlyInitialValues` in anticipation of fields having not been
    // registered...
    this._earlyInitialValues = clone(nextProps.initialValues)

    // ... And we will take the appropriate steps to set these new initialValues
    // with the assumption that fields may have been registered.
    this.setState(prevState => {
      const newState = clone(prevState)

      // Iterate only registered fields to set values
      for (let name in newState.fields) {
        let value = String(nextProps.initialValues[name])
        newState.fields[name].value = value
        newState.values[name] = value
      }

      if (this.props.validate) {

        // Validate the form. Note that this will only validate registered fields because
        // `newState.values` can only be filled by registered fields
        newState.errors = clone(this.props.validate(newState.values) || {})
        newState.validForm = !Object.keys(newState.errors).length

        // Iterage only registered fields again to update state with errors
        for (let name in newState.fields) {
          newState.fields[name].error = newState.errors[name] || ''
          newState.fields[name].validField = !newState.fields[name].error
        }
      }

      return newState
    })
  }

  registerField(name) {
    this.setState(prevState => {
      let newState = clone(prevState)
      newState.fields[name] = initialFieldState()
      newState.values[name] = ''

      if (this._earlyInitialValues && this._earlyInitialValues[name]) {
        const value = String(this._earlyInitialValues[name])
        newState.fields[name].value = value
        newState.values[name] = value

        // Call to validate replaces state with new state
        newState = this.validate(name, newState)
      }

      return newState
    })
  }

  setFieldState(name, state, cb) {
    let newState = clone(this.state)

    // Apply new state
    newState.fields[name] = Object.assign(newState.fields[name], state)

    // Apply visited to form also
    if (state.visited) newState.visited = true

    // When the value has changed
    if (state.hasOwnProperty('value')) {

      // Set some formState values which are not passed into setFieldState
      newState.values[name] = state.value
      newState.dirty = true

      // Call to validate replaces state with new state
      newState = this.validate(name, newState)
    }

    this.setState(newState, () => {
      if (typeof cb === 'function') cb(this.getFormState())
    })
  }

  getFormState() {
    return Object.assign({}, clone(this.state), {
      resetForm: this.resetForm
    })
  }

  onChange(name, formState) {
    const { onChange } = this.props
    if (onChange) onChange(name, formState)
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

  onSubmit(e) {
    const { validForm, values } = this.state
    if (!validForm || this.props.onSubmit) e.preventDefault()

    // Invalid form
    if (!validForm) {
      this.setState({ submitting: false, submitFailed: true, hasSubmitted: true })
      return false
    }

    // New state just before submit
    this.setState({ submitting: true, hasSubmitted: true, submitFailed: false }, () => {

      // If a custom submit handler was provided
      if (this.props.onSubmit) {
        this.props.onSubmit(values, this.getFormState())
          .then(() => this.setState({ submitting: false, dirty: false }))
          .catch(() => this.setState({ submitting: false, submitFailed: true }))
      }
    })
  }

  resetForm() {
    this.setState(prevState => {
      const newState = Object.assign(clone(prevState), {
        hasSubmitted: false,
        submitFailed: false,
        submitting: false,
        dirty: false
      })

      // Iterate only registered fields to set values
      for (let name in newState.fields) {
        newState.fields[name] = initialFieldState()
        newState.values[name] = ''
      }

      return newState
    })
  }

  render() {
    const props = {
      onSubmit: this.onSubmit
    }

    return typeof this.props.children === 'function'
      ? this.props.children(props, this.getFormState())
      : <form {...props}>{this.props.children}</form>
  }
}

Form.childContextTypes = {
  registerField: React.PropTypes.func,
  setFieldState: React.PropTypes.func,
  getFormState: React.PropTypes.func,
  onChange: React.PropTypes.func
}

Form.propTypes = {
  onSubmit: React.PropTypes.func,
  validate: React.PropTypes.func,
  initialValues: React.PropTypes.object
}

export default Form
