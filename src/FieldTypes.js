import React from 'react'
import PropTypes from 'prop-types'

const TextField = ({ fieldState, events }) => (
  <input type={fieldState.props.type || 'text'} value={fieldState.value} {...events} />
)

TextField.propTypes = {
  fieldState: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired
}


const CheckboxField = ({ originalValue, fieldState, events }) => {
  const { value: stateValue } = fieldState
  const checked = stateValue !== ''
  return <input type="checkbox" value={originalValue} checked={checked} {...events} />
}

CheckboxField.propTypes = {
  originalValue: PropTypes.any.isRequired,
  fieldState: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired
}


const RadioField = ({ originalValue, fieldState, events }) => {
  const { value: stateValue } = fieldState
  const originalProps = fieldState.props[originalValue]
  const checked = stateValue === originalValue
  return <input type="radio" value={originalValue} checked={checked} {...events} />
}

RadioField.propTypes = {
  originalValue: PropTypes.any.isRequired,
  fieldState: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired
}


export { TextField, CheckboxField, RadioField }
