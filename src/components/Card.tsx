type Props = {
  children: React.ReactNode
  className?: string
}

const Card = ({ children, className }: Props) => {
  return (
    <div
      className={`mt-6 flex h-full w-full flex-col rounded-xl bg-white p-6 shadow-md sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
