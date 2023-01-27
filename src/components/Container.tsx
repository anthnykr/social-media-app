import React from "react"

type Props = {
  active?: boolean
  className?: string
  children: React.ReactNode
}

const Container: React.FC<Props> = ({ className, active, children }) => {
  return (
    <div
      className={`${className} flex rounded-xl py-3 ${
        active ? "bg-white" : "bg-gray-50"
      }`}
    >
      {children}
    </div>
  )
}

export default Container
