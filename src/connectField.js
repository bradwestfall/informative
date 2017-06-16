import React, { Component, PropTypes } from 'react';

const connectField = name => {
  return WrappedComponent => {
    return class extends Component {

      constructor() {
        super()
        this.onChange = this.onChange.bind(this)
      }

      componentWillMount() {
        this.context.registerField(name)
      }

      static contextTypes = {
        registerField: PropTypes.func,
        getFormState: PropTypes.func,
        setFieldState: PropTypes.func,
        onChange: React.PropTypes.func,
      }

      onChange(e) {
        const { onChange} = this.props
        const newState = { value: e.target.value, dirty: true }

        this.context.setFieldState(name, newState, formState => {
          if (onChange) onChange(e, formState)
          this.context.onChange(name, formState) // call the form's onChange
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
