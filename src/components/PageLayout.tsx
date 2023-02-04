import Head from "next/head"
import NavBar from "./NavBar"

type Props = {
  children: React.ReactNode
  className?: string
  pageTitle: string
}

const PageLayout = ({ children, className, pageTitle }: Props) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <NavBar />
      <div className={`flex w-full flex-col items-center ${className}`}>
        {children}
      </div>
    </>
  )
}

export default PageLayout
