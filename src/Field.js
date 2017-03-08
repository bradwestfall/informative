import React from 'react'

class Field extends React.Component {

  componentWillMount() {
    this.context.registerField(this.props.name)
  }

  render() {
    const { children: callback, name } = this.props
    const formState = this.context.getFormState() || {}
    const state = formState.fields[name]

    // Bail if name not provided
    if (!name) throw new Error('the `name` prop must be provided to `<Field>`')

    // Don't render if state hasn't been setup
    if (!state) return null

    const props = {
      name,
      value: state.value,
      onChange: e => this.context.setFieldState(name, { value: e.target.value, dirty: true }),
      onFocus: e => this.context.setFieldState(name, { visited: true, active: true }),
      onBlur: e => this.context.setFieldState(name, { active: false })
    }

    if (typeof callback === 'function') {
      return callback(props, state, formState)
    } else if (this.props.component) {
      const type = this.props.type || 'text'
      switch(this.props.component) {
        case 'input': return <input type={type} name={name} {...props} />
        case 'textarea': return <textarea name={name} {...props} />
      }
    } else {
      throw new Exception('Field must have good shit')
    }
  }
}

Field.contextTypes = {
  registerField: React.PropTypes.func,
  getFormState: React.PropTypes.func,
  setFieldState: React.PropTypes.func,
  component: React.PropTypes.string
}

Field.propTypes = {
  name: React.PropTypes.string.isRequired
}

export default Field
