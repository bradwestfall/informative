import React from 'react'
import connectField from './connectField'

class Field extends React.Component {

  componentWillMount() {
    this.context.registerField(this.props.name)
  }

  render() {
    const { component: Component, name, ...rest } = this.props

    // Bail if name not provided
    if (!name) throw new Error('the `name` prop must be provided to `<Field>`')

    // If <Field /> was passed a component prop with a component value
    // If we have a component the HOC will do all the work, just trust its magic
    if (typeof Component === 'function') {
      const WrappedComponent = connectField(name)(Componet);
      return <WrappedComponent {...rest} />
    }

    // If <Field /> was passed a string component
    // Might want to change this prop to be "type" and not overload the Component prop with two jobs?
    if (typeof Component === 'string') {
      const type = this.props.type || 'text'
      switch(Component) {
        case 'input': return connectField(name)(<input {...rest} type={type} />)
        case 'textarea': return connectField(name)(<textarea {...rest} />)
      }
    }

    throw new Error('Field must have a component prop or pass a function as children to return an alternate field')
  }
}

Field.contextTypes = {
  registerField: React.PropTypes.func,
  getFormState: React.PropTypes.func,
  setFieldState: React.PropTypes.func
  //component: React.PropTypes.string
}

Field.propTypes = {
  name: React.PropTypes.string.isRequired
}

export default Field
