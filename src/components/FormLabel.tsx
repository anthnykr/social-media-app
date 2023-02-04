import React from "react"

type Props = {
  htmlFor: string
  children: React.ReactNode
}

function FormLabel({ htmlFor, children }: Props) {
  return (
    <label htmlFor={htmlFor}>
      {children}&nbsp;
      <span className="text-red-500">*</span>
    </label>
  )
}

export default FormLabel
