import React from 'react'

export const TextField = props => {
  const { name, type, input, fieldState, formState, ...rest } = props
  return <input {...rest} name={name} type={type} {...input} />
}

export const CheckboxField = props => {
  const { name, input, fieldState, formState, ...rest } = props
  return <input {...rest} name={name} type="checkbox" checked={input.value} {...input} />
}

export const RadioField = props => {
  const { name, input, fieldState, formState, ...rest } = props
  const checked = input.value === rest.value
  delete input.value
  return <input {...rest} name={name} type="radio" checked={checked} {...input} />
}
