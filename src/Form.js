import React from 'react'
import PropTypes from 'prop-types'

// http://stackoverflow.com/a/5344074
const clone = obj => JSON.parse(JSON.stringify(obj))

const initialFieldState = () => ({
  value: '',
  error: '',
  validField: true,
  visited: false,
  dirty: false,
  active: false,
  touched: false,
})

class Form extends React.Component {

  static _isMounted = false

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
    this._isMounted = true
    // No fields will have been registered at this point. So we're holding onto this
    // value for when `registerField` has been called later on
    if (this.props.initialValues) {
      this._earlyInitialValues = clone(this.props.initialValues)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
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
        const value = String(nextProps.initialValues[name] || '')
        newState.fields[name].value = value
        newState.values[name] = value
      }

      // Call to validate replaces state with new state
      return this.validate(newState)
    })
  }

  registerField(name) {
    this.setState(prevState => {
      const newState = clone(prevState)
      newState.fields[name] = initialFieldState()
      newState.values[name] = ''

      if (this._earlyInitialValues && this._earlyInitialValues[name]) {
        const value = String(this._earlyInitialValues[name])
        newState.fields[name].value = value
        newState.values[name] = value
      }

      // Call to validate replaces state with new state
      return this.validate(newState)
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
      newState = this.validate(newState)
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

  validate(state) {
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
        const submitResponse = this.props.onSubmit(values, this.getFormState())

        // If the response is a promise
        if (typeof submitResponse === 'object' && typeof submitResponse.then === 'function') {
          submitResponse
            .then(() => {

              // Next Tick (wait for possible `componentWillUnmount()`). The user might have
              // unmounted the form in their `onSubmit` callback
              setTimeout(() => {

                // If the form is still mounted
                if (this._isMounted) {
                  this.setState({ submitting: false, dirty: false })
                }
              }, 0)
            })
            .catch(() => this.setState({ submitting: false, submitFailed: true }))
        } else {
          throw new Error('`onSubmit` expectes the return value to be a promise.')
        }

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
  registerField: PropTypes.func,
  setFieldState: PropTypes.func,
  getFormState: PropTypes.func,
  onChange: PropTypes.func
}

Form.propTypes = {
  onSubmit: PropTypes.func,
  validate: PropTypes.func,
  initialValues: PropTypes.object
}

export default Form
