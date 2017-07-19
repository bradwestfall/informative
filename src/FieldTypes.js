import React from 'react'
import PropTypes from 'prop-types'

/****************************************
  <input type="text">
*****************************************/

const TextField = ({ name, fieldState, events }) => (
  <input name={name} type={fieldState.props.type || 'text'} value={fieldState.value} {...events} />
)

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  fieldState: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired
}

/****************************************
  <input type="checkbox>
*****************************************/

const CheckboxField = ({ name, originalValue, fieldState, events }) => {
  const { value: stateValue } = fieldState
  const checked = stateValue !== ''
  return <input name={name} type="checkbox" value={originalValue} checked={checked} {...events} />
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

const RadioField = ({ name, originalValue, fieldState, events }) => {
  const { value: stateValue } = fieldState
  const originalProps = fieldState.props[originalValue]
  const checked = stateValue === originalValue
  return <input name={name} type="radio" value={originalValue} checked={checked} {...events} />
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

const SelectField = ({ name, children, fieldState, events }) => {
  return <select name={name} value={fieldState.value} {...events}>{children}</select>
}

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  fieldState: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired
}

/****************************************
  <textarea>
*****************************************/

const TextareaField = ({ name, fieldState, events }) => (
  <textarea name={name} value={fieldState.value} {...events} />
)

TextareaField.propTypes = {
  name: PropTypes.string.isRequired,
  fieldState: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired
}

export { TextField, CheckboxField, RadioField, SelectField, TextareaField }
