import React, {Component, PropTypes} from 'react';

function connectField(name) {
  return function(WrappedComponent){
    return class extends Component {
      componentWillMount() {
        this.context.registerField(name)
      }
      static contextTypes = {
        registerField: PropTypes.func,
        getFormState: PropTypes.func,
        setFieldState: PropTypes.func,
      }
      render() {
        // Bail if name not provided
        if (!name) throw new Error('You must provide a name to connectField. Usage connectField(name)(Component)')
        const formState = this.context.getFormState() || {}
        const fieldState = formState.fields[name]

        // Don't render if fieldState hasn't been setup
        if (!fieldState) return null

        const input = {
          name,
          value: fieldState.value,
          onChange: e => this.context.setFieldState(name, { value: e.target.value, dirty: true }),
          onFocus: e => this.context.setFieldState(name, { visited: true, active: true }),
          onBlur: e => this.context.setFieldState(name, { active: false })
        }
        return <WrappedComponent {...this.props} input={input} fieldState={fieldState} formState={formState} />;
      }
    }
  }
}

export default connectField;
