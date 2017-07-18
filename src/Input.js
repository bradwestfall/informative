import React from 'react'

const Input = props => {
  const { type, name, value, originalProps, ...rest } = props

  if (type === 'checkbox') {
    if (typeof value !== 'boolean') console.warn('Checkboxes require a value prop with a boolean value')
    return <input {...originalProps} type="checkbox" name={name} checked={value} {...rest} />

  } else if (type === 'radio') {
    originalProps.checked = originalProps.value === value
    return <input {...originalProps} type="radio" name={name} {...rest} />

  } else {
    return <input {...originalProps} type={type || 'text'} name={name} value={value} {...rest} />
  }
}

export default Input
