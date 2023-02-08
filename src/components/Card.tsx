type Props = {
  children: React.ReactNode
  className?: string
}

const Card = ({ children, className }: Props) => {
  return (
    <div
      className={`mt-6 flex h-full w-2/5 flex-col rounded-xl bg-white p-6 shadow-md ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
