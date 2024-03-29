import { type AppType } from "next/app"
import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

import { trpc } from "../utils/trpc"

import "../styles/globals.css"
import { Toaster } from "react-hot-toast"

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main>
        <Component {...pageProps} />
        <Toaster />
      </main>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
