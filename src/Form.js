import React from 'react'
import PropTypes from 'prop-types'

// http://stackoverflow.com/a/5344074
const clone = obj => JSON.parse(JSON.stringify(obj))

const initialFieldState = value => ({
  value: value === undefined ? '' : value,
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
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  registerField(name, value) {
    this.setState(prevState => {
      const newState = clone(prevState)

      // If the field doesn't exist
      // OR, it does exist and the value is set and different
      //if (!newState.fields[name] || (newState.fields[name] && value !== undefined && newState.fields[name].value !== value)) {
      if (!newState.fields[name] || (newState.fields[name] && value !== undefined)) {
        newState.fields[name] = initialFieldState(value)
        newState.values[name] = newState.fields[name].value

        // Call to validate replaces state with new state
        return this.validate(newState)
      }

      return prevState
    })
  }

  setFieldState(name, state, cb) {
    this.setState(prevState => {
      let newState = clone(prevState)

      // Apply new state
      newState.fields[name] = Object.assign(newState.fields[name], state)

      // Apply visited to form also
      if (state.visited) newState.visited = true

      // If state has value property then the value changed
      if (state.hasOwnProperty('value')) {

        // Set some formState values which are not passed into setFieldState
        newState.values[name] = state.value
        newState.dirty = true

        // Call to validate replaces state with new state
        newState = this.validate(newState)
      }

      return newState
    }, () => {
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
    const props = { onSubmit: this.onSubmit }
    const form = this.props.render
      ? this.props.render(props, this.getFormState())
      : <form {...props}>{this.props.children}</form>

    if (!form.type || form.type !== 'form') throw new Error('<Form render={fn} /> must return a single <form> DOM element.')
    if (!form.props.onSubmit) throw new Error('Be sure to spread `formProps` on your returned <form {...formProps}>')

    return form
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
  render: PropTypes.func
}

export default Form
