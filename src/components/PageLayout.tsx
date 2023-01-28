import NavBar from "./NavBar"

type Props = {
  children: React.ReactNode
  className?: string
}

const PageLayout = ({ children, className }: Props) => {
  return (
    <>
      <NavBar />
      <div className={`flex w-full flex-col items-center ${className}`}>
        {children}
      </div>
    </>
  )
}

export default PageLayout
