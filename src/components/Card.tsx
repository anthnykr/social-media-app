type Props = {
  children: React.ReactNode
  className?: string
}

const Card = ({ children, className }: Props) => {
  return (
    <div
      className={`mt-6 flex h-full flex-col rounded-xl bg-white p-6 shadow-md md:w-4/5 lg:w-3/5 xl:w-2/5 ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
