import React from 'react'
import PropTypes from 'prop-types'

const cleanProps = props => {
  delete props.name
  delete props.originalValue
  delete props.formState
  delete props.fieldState
  delete props.events
  return props
}

/****************************************
  <input type="text">
*****************************************/

const TextField = ({ name, fieldState, events, ...rest }) => {
  const props = cleanProps(rest)
  return <input {...props} name={name} type={fieldState.props.type || 'text'} value={fieldState.value} {...events} />
}

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  fieldState: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired
}

/****************************************
  <input type="checkbox>
*****************************************/

const CheckboxField = ({ name, originalValue, fieldState, events, ...rest }) => {
  const { value: stateValue } = fieldState
  const checked = stateValue !== ''
  const props = cleanProps(rest)
  return <input {...props} name={name} type="checkbox" value={originalValue} checked={checked} {...events} />
}

CheckboxField.propTypes = {
  name: PropTypes.string.isRequired,
  originalValue: PropTypes.any.isRequired,
  fieldState: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired
}

/****************************************
  <input type="radio>
*****************************************/

const RadioField = ({ name, originalValue, fieldState, events, ...rest }) => {
  const { value: stateValue } = fieldState
  const checked = stateValue === originalValue
  const props = cleanProps(rest)
  return <input {...props} name={name} type="radio" value={originalValue} checked={checked} {...events} />
}

RadioField.propTypes = {
  name: PropTypes.string.isRequired,
  originalValue: PropTypes.any.isRequired,
  fieldState: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired
}

/****************************************
  <select>
*****************************************/

const SelectField = ({ name, children, fieldState, events, ...rest }) => {
  const props = cleanProps(rest)
  return <select {...props} name={name} value={fieldState.value} {...events}>{children}</select>
}

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  fieldState: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired
}

/****************************************
  <textarea>
*****************************************/

const TextareaField = ({ name, fieldState, events, ...rest }) => {
  const props = cleanProps(rest)
  return <textarea {...props} name={name} value={fieldState.value} {...events} />
}

TextareaField.propTypes = {
  name: PropTypes.string.isRequired,
  fieldState: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired
}

export { TextField, CheckboxField, RadioField, SelectField, TextareaField }
