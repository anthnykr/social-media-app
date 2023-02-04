import {
  BroadActivityFeed20Filled,
  ChatHelp20Filled,
  ContactCard20Filled,
  People20Filled,
  PeopleAdd20Filled,
  ArrowExit20Filled,
} from "@fluentui/react-icons"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"

export default function NavBar() {
  const { data: session, status } = useSession()

  const id = session?.user?.id
  const isLoggedIn = !!session?.user?.email
  const displayNavButtons = status !== "loading"

  const logout = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="sticky flex w-screen items-center justify-between bg-black px-5 py-3 text-white">
      <p className="text-3xl font-semibold">KroTalk</p>

      {isLoggedIn && displayNavButtons && (
        <div className="flex">
          <Link href="/" className="navItem">
            <BroadActivityFeed20Filled />
            <span>News Feed</span>
          </Link>

          <Link href={`/${id}`} className="navItem">
            <ContactCard20Filled />
            <span>My Profile</span>
          </Link>

          <Link href="/my-friends" className="navItem">
            <People20Filled />
            <span>My Friends</span>
          </Link>

          <Link href="/friend-requests" className="navItem">
            <PeopleAdd20Filled />
            <span>Friend Requests</span>
          </Link>

          <Link href="/contact-us" className="navItem">
            <ChatHelp20Filled />
            <span>Contact Us</span>
          </Link>

          <button onClick={logout} className="navItem">
            <ArrowExit20Filled />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
