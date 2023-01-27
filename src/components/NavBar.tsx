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

export default function NavBar() {
  const { data: session, status } = useSession()

  const isLoggedIn = !!session?.user?.email
  const displayNavButtons = status !== "loading"

  const id = session?.user?.id

  const logout = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="fixed flex w-screen items-center justify-between bg-black px-5 py-3 text-white">
      <p className="text-3xl font-semibold">KroTalk</p>

      {isLoggedIn && displayNavButtons && (
        <div className="flex">
          <div className="navItem">
            <BroadActivityFeed20Filled />
            <span>News Feed</span>
          </div>

          <div className="navItem">
            <ChatHelp20Filled />
            <span>Contact Us</span>
          </div>

          <div className="navItem">
            <ContactCard20Filled />
            <span>My Profile</span>
          </div>

          <div className="navItem">
            <People20Filled />
            <span>My Friends</span>
          </div>

          <div className="navItem">
            <PeopleAdd20Filled />
            <span>Friend Requests</span>
          </div>

          <button onClick={logout} className="navItem">
            <ArrowExit20Filled />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
