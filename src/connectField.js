import React, { Component } from 'react'
import PropTypes from 'prop-types'

const connectField = name => {
  return WrappedComponent => {
    return class extends Component {

      constructor() {
        super()
        this.onChange = this.onChange.bind(this)
        this.updateFieldState = this.updateFieldState.bind(this)
      }

      componentWillMount() {
        this.context.registerField(name, this.props.value)
      }

      static contextTypes = {
        registerField: PropTypes.func,
        getFormState: PropTypes.func,
        setFieldState: PropTypes.func,
        onChange: React.PropTypes.func,
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
        const { onChange } = this.props
        this.context.setFieldState(name, newState, formState => {
          if (onChange) onChange(e, formState)   // call the field's onChange if the user provided one
          this.context.onChange(name, formState) // call the form's onChange if the user provided one
        })
      }

      render() {
        // Bail if name not provided
        if (!name) throw new Error('You must provide a `name` to `connectField`. Usage `connectField(name)(Component)`')
        const formState = this.context.getFormState() || {}
        const fieldState = formState.fields[name]

        // Don't render if fieldState hasn't been setup
        if (!fieldState) return null

        const input = {
          name,
          value: fieldState.value,
          onChange: this.onChange,
          onFocus: e => this.context.setFieldState(name, { visited: true, active: true }),
          onBlur: e => this.context.setFieldState(name, { active: false, touched: true })
        }

        return <WrappedComponent {...this.props} input={input} fieldState={fieldState} formState={formState} />;
      }

    }
  }
}

export default connectField
