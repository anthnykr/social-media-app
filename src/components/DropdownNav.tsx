import { Menu } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import Link from "next/link"
import {
  BroadActivityFeed20Filled,
  ChatHelp20Filled,
  ContactCard20Filled,
  People20Filled,
  PeopleAdd20Filled,
  ArrowExit20Filled,
} from "@fluentui/react-icons"
import { signOut, useSession } from "next-auth/react"

export default function DropDownNav() {
  const { data: session } = useSession()
  const id = session?.user?.id
  const email = session?.user?.email

  const logout = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <Menu as="div" className="relative text-left">
      <div>
        <Menu.Button className="navItem font-semibold">
          Menu
          <ChevronDownIcon className="h-5 w-5" />
        </Menu.Button>
      </div>

      <Menu.Items className="absolute right-0 w-56 divide-y divide-gray-200 rounded-md bg-white text-black shadow-lg">
        <div className="px-4 py-3">
          <p>Signed in as</p>
          <p className="truncate text-sm">{email}</p>
        </div>
        <div className="py-1">
          <Menu.Item>
            <Link href="/" className="navItem">
              <BroadActivityFeed20Filled />
              <span>News Feed</span>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link href={`/${id}`} className="navItem">
              <ContactCard20Filled />
              <span>My Profile</span>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link href="/my-friends" className="navItem">
              <People20Filled />
              <span>My Friends</span>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link href="/friend-requests" className="navItem">
              <PeopleAdd20Filled />
              <span>Friend Requests</span>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link href="/contact-us" className="navItem">
              <ChatHelp20Filled />
              <span>Contact Us</span>
            </Link>
          </Menu.Item>
        </div>
        <div className="py-1">
          <Menu.Item>
            <button onClick={logout} className="navItem">
              <ArrowExit20Filled />
              Logout
            </button>
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  )
}
