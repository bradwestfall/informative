import React from 'react'
import PropTypes from 'prop-types'
import { cloneDeep } from 'lodash/lang'

// http://stackoverflow.com/a/5344074
// const clone = obj => JSON.parse(JSON.stringify(obj))
const clone = cloneDeep

const initialFieldState = value => ({
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
      fieldFormats: {},
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

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  registerField(name, fieldState) {
    this.setState(prevState => {
      const newFormState = clone(prevState)

      // If the previous state already has this name, then two fields are trying to
      // register the same name which means this field is apart of a radio group
      if (prevState.fields[name]) {

        // If the fieldname has already been setup for "radio mode"
        if (prevState.fields[name].radio) {
          newFormState.fields[name].props[fieldState.value] = fieldState.props

        // If the fieldname has not been setup for "radio mode"
        } else {
          // This happens when we've encountered a second field with an already-used
          // name and so now we need to retroactively go back and set the previous
          // field to be a radio field (by marking it with `radio: true`) and
          // also to store each respective radio field's value in the props so
          // know what to set the overall value to when clicked

          newFormState.fields[name] = Object.assign(newFormState.fields[name], {
            props: {
              // This "value" represents the first field that was registered
              [prevState.fields[name].props.value]: clone(prevState.fields[name].props),
              // This "value" is the current (the second) radio field. Note that a third
              // radio field will not hit this `else` clause at all, but will it the
              // respective `if` clause
              [fieldState.value]: fieldState.props
            },
            radio: true // radio mode
          })

        }

        // Set the value based on which radio is checked
        for (let key in newFormState.fields[name].props) {
          if (newFormState.fields[name].props.hasOwnProperty(key) && newFormState.fields[name].props[key].checked) {
            newFormState.fields[name].value = newFormState.fields[name].props[key].value
          }
        }

        // Set form's values
        newFormState.values[name] = newFormState.fields[name].value

      // Not in radio group mode (or the first radio which doesn't have a duplicate name yet)
      } else {

        // Checkbox
        if (fieldState.props.checked === false) {
          fieldState.value = ''
        }

        // Blend fieldState into initialFieldState
        newFormState.fields[name] = Object.assign(initialFieldState(), fieldState)

        // Assign the value to the form's state list of values
        newFormState.values[name] = newFormState.fields[name].value

      }

      // Call to validate replaces state with new state
      return this.validate(newFormState)
    })
  }

  // When fields get changed in any way: value, blur, focus, etc
  setFieldState(name, state, cb) {
    const formValueFormatter = this.props.format
    const formTrim = this.props.trim
    const fieldValueFormatter = this.state.fields[name].format
    const fieldTrim = this.state.fields[name].trim

    this.setState(prevState => {
      let newState = clone(prevState)

      // Apply new state
      newState.fields[name] = Object.assign(newState.fields[name], state)

      // Apply visited to form also
      if (state.visited) newState.visited = true

      // If state has value property then the value changed
      if (state.hasOwnProperty('value')) {

        // Apply field format and form format functions
        var value = formValueFormatter(fieldValueFormatter(state.value), name)

        // Apply Trim Logic. The field version takes precedence over the form version
        if (fieldTrim === true || (fieldTrim !== false) && formTrim === true && value.trim) {
          value = value.trim()
        }

        newState.values[name] = value

        // Set some formState values which are not passed into setFieldState
        newState.dirty = true

        // Call to validate replaces state with new state
        newState = this.validate(newState)
      }

      return newState
    }, () => {
      if (typeof cb === 'function') cb(this.getFormState().fields[name], this.getFormState())
    })

  }

  getFormState() {
    return clone(this.state)
  }

  onChange(name, e) {
    if (this.props.onChange) this.props.onChange(this.getFormState(), name, e)
  }

  validate(state) {
    if (!this.props.validate) return state

    const newState = clone(state)
    newState.errors = clone(this.props.validate(state.values, this.getFormState()) || {})
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
        const submitResponse = this.props.onSubmit(Object.assign({}, values), this.getFormState())

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
        newState.fields[name] = Object.assign({}, prevState.fields[name], initialFieldState())
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

Form.defaultProps = {
  trim: true,
  format: value => value
}

Form.propTypes = {
  onSubmit: PropTypes.func,
  validate: PropTypes.func,
  render: PropTypes.func,
  format: PropTypes.func,
  trim: PropTypes.bool
}

export default Form
