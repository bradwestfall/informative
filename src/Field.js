import React from 'react'
import PropTypes from 'prop-types'

class Field extends React.Component {

  constructor() {
    super()
    this.onChange = this.onChange.bind(this)
  }

  componentWillMount() {
    this.context.registerField(this.props.name)
  }

  onChange(e) {
    const { name, onChange} = this.props
    const { type, target } = e

    const value = target.type === 'checkbox' ? target.checked : target.value
    const newState = { value, dirty: true }

    // Set the field's state within the form, then after the new state
    // call this callback
    this.context.setFieldState(name, newState, formState => {
      if (onChange) onChange(e, formState)
      this.context.onChange(name, formState) // call the form's onChange
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

    // If <Field /> is providing a field wrap by virtue of function
    if (typeof render === 'function') {
      return render(input, fieldState, formState)

    // If <Field /> was passed a string component
    } else if (typeof Component === 'string') {
      const type = this.props.type || 'text'
      switch(Component) {
        case 'input': return <input {...rest} type={type} name={name} {...input} />
        case 'textarea': return <textarea {...rest} name={name} {...input} />
        case 'select': return <select {...rest} name={name} {...input}>{children}</select>
      }

    // If <Field /> was passed a component prop with a component value
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
