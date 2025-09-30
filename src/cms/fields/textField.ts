import type { Field } from 'payload'

type TextFieldType = (
  name: string,
  label: string,
  required?: boolean,
  description?: string,
  textArea?: boolean,
  other?: object,
) => Field

export const textField: TextFieldType = (name, label, required = false, description, textArea = false, other) => {
  return textArea ?
    {
      name,
      label,
      admin: description ? {
        description
      } : undefined,
      type: 'textarea',
      required,
      ...other
    } :
    {
      name,
      label,
      admin: description ? {
        description
      } : undefined,
      type: 'text',
      required,
      ...other
    }
}