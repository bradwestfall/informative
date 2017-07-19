import React from 'react'
import PropTypes from 'prop-types'
import { TextField, CheckboxField, RadioField } from './FieldTypes'

class Field extends React.Component {

  constructor() {
    super()
    this.onChange = this.onChange.bind(this)
    this.getInitialValue = this.getInitialValue.bind(this)
    this.updateFieldState = this.updateFieldState.bind(this)
  }

  componentWillMount() {
    const { name } = this.props
    this.context.registerField(name, this.getInitialValue(this.props))
  }

  // Prop Change for `value`
  componentWillReceiveProps(nextProps) {
    if (nextProps.value === this.props.value && nextProps.checked === this.props.checked) return false
    this.updateFieldState({ value: this.getInitialValue(nextProps) })
  }

  getInitialValue(props) {

    // Radio
    if (props.type && props.type.toLowerCase() === 'radio') {
      return props.checked ? props.value : undefined

    // Checkbox
    } else if (props.type && props.type.toLowerCase() === 'checkbox') {
      return props.checked ? props.value || true : ''

    // Other
    } else {
      return props.value
    }

  }

  // DOM Change
  onChange(e) {
    const { target } = e
    const isCheckbox = target.type === 'checkbox'

    let value = ''
    if (isCheckbox) {

      value = target.checked ? target.value : ''
    } else {
      value = target.value
    }


    // const value =


    // const value = target.type === 'checkbox' ? target.checked : target.value
    //const value = target.value

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

    // If <Field component="input" /> was passed a string "input" component
    } else if (typeof Component === 'string' && Component.toLowerCase() === 'input') {
      const type = this.props.type
      switch(type) {
        case 'checkbox': return <CheckboxField {...rest} name={name} input={input} />
        case 'radio': return <RadioField {...rest} name={name} input={input} />
        case 'text':
        default: return <TextField {...rest} type={type || 'text'} name={name} input={input} />
      }

    // If <Field component="[string]" /> was passed a string component
    } else if (typeof Component === 'string') {
      switch(Component) {
        case 'textarea': return <textarea {...rest} name={name} {...input} />
        case 'select': return <select {...rest} name={name} {...input}>{children}</select>
        default: throw new Error('Invalid Component Prop: ', Component)
      }

    // If <Field component={CustomField} /> was passed a component prop with a custom component
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
