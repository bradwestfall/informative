import React from 'react'

const Input = props => {
  const { type, name, value, ...rest } = props

  if (type === 'checkbox') {
    if (typeof value !== 'boolean') console.warn('Checkboxes require a value prop with a boolean value')
    return <input type={type} name={name} checked={value} {...rest} />
  } else {
    return <input type={type || 'text'} name={name} value={value} {...rest} />
  }
}

export default Input
