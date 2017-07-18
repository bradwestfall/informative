import React from 'react'
import PropTypes from 'prop-types'
import Input from './Input'

class Field extends React.Component {

  constructor() {
    super()
    this.onChange = this.onChange.bind(this)
    this.updateFieldState = this.updateFieldState.bind(this)
  }

  componentWillMount() {
    const { name, value } = this.props
    this.context.registerField(name, value)
  }

  // Prop Change for `value`
  componentWillReceiveProps(nextProps) {
    if (nextProps.value === this.props.value) return false
    this.updateFieldState({ value: nextProps.value })
  }

  // DOM Change
  onChange(e) {
    const { type, target } = e
    const value = target.type === 'checkbox' ? target.checked : target.value
    this.updateFieldState({ value, dirty: true })
  }

  updateFieldState(newState) {
    const { name, onChange } = this.props
    this.context.setFieldState(name, newState, formState => {
      if (onChange) onChange(e, formState)   // call the field's onChange if the user provided one
      this.context.onChange(name, formState) // call the form's onChange if the user provided one
    })
  }

  render() {
    const { children, render, component: Component, name, ...rest } = this.props
    const formState = this.context.getFormState() || {}
    const fieldState = formState.fields[name]

    // Bail if name not provided
    if (!name) throw new Error('the `name` prop must be provided to `<Field>`')

    // Don't render if fieldState hasn't been setup
    if (!fieldState) return null

    const input = {
      name,
      value: fieldState.value,
      onChange: this.onChange,
      onFocus: e => this.context.setFieldState(name, { visited: true, active: true }),
      onBlur: e => this.context.setFieldState(name, { active: false, touched: true })
    }

    // If <Field render={fn} /> is providing a field wrap by virtue of function
    if (typeof render === 'function') {
      return render(input, fieldState, formState)

    // If <Field component="string" /> was passed a string component
    } else if (typeof Component === 'string') {
      const type = this.props.type || 'text'
      switch(Component) {
        case 'input': return <Input originalProps={rest} type={type} name={name} {...input} />
        case 'textarea': return <textarea {...rest} name={name} {...input} />
        case 'select': return <select {...rest} name={name} {...input}>{children}</select>
        default: throw new Error('Invalid Component Prop: ', Component)
      }

    // If <Field component={Custom} /> was passed a component prop with a component value
    } else if (typeof Component === 'function') {
      return <Component {...rest} name={name} input={input} fieldState={fieldState} formState={formState} />

    // Only the above three are allowed
    } else {
      throw new Error('Field must have a component prop or pass a function as children to return an alternate field')
    }
  }
}

Field.contextTypes = {
  registerField: PropTypes.func,
  setFieldState: PropTypes.func,
  getFormState: PropTypes.func,
  onChange: PropTypes.func
}

Field.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func
}

export default Field
