import { useSession } from "next-auth/react"
import DropDownNav from "./DropdownNav"

export default function NavBar() {
  const { data: session, status } = useSession()

  const isLoggedIn = !!session?.user?.email
  const displayNavButtons = status !== "loading"

  return (
    <div className="fixed z-50 flex h-[64px] w-screen items-center justify-between bg-black px-5 py-3 text-white">
      <p className="text-3xl font-semibold">KroTalk</p>

      {isLoggedIn && displayNavButtons && <DropDownNav />}
    </div>
  )
}
