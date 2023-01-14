import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function NavBar() {
  const { data: session, status } = useSession()

  const isLoggedIn = !!session?.user?.email
  const displayAuthButtons = status !== "loading"

  const id = session?.user?.id

  const logout = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    // add something to direct to login page if not logged in
    <div className="flex w-screen items-center justify-between bg-black px-5 py-3 text-white">
      <p className="text-2xl font-semibold">KroTalk</p>

      <div className="flex items-center">
        <Link href="/" className="navBarButton">
          News Feed
        </Link>
        <Link href={`/${id}`} className="navBarButton">
          Profile
        </Link>
      </div>

      {isLoggedIn && displayAuthButtons && (
        <button onClick={logout} className="navBarButton">
          Logout
        </button>
      )}

      {!isLoggedIn && displayAuthButtons && (
        <div className="cursor-default px-12 py-3">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      )}
    </div>
  )
}
