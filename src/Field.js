import React from 'react'

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
    const newState = { value: e.target.value, dirty: true }

    this.context.setFieldState(name, newState, formState => {
      if (onChange) onChange(e, formState)
      this.context.onChange(name, formState) // call the form's onChange
    })
  }

  render() {
    const { children: callback, component: Component, name, ...rest } = this.props
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
    if (typeof callback === 'function') {
      return callback(input, fieldState, formState)

    // If <Field /> was passed a string component
    } else if (typeof Component === 'string') {
      const type = this.props.type || 'text'
      switch(Component) {
        case 'input': return <input {...rest} type={type} name={name} {...input} />
        case 'textarea': return <textarea {...rest} name={name} {...input} />
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
  registerField: React.PropTypes.func,
  setFieldState: React.PropTypes.func,
  getFormState: React.PropTypes.func,
  onChange: React.PropTypes.func
}

Field.propTypes = {
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func
}

export default Field
