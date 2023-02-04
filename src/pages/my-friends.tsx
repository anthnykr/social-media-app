import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import Card from "../components/Card"
import PageLayout from "../components/PageLayout"
import { trpc } from "../utils/trpc"

const MyFriends: NextPage = () => {
  const { data } = trpc.friend.getFriends.useQuery()
  const friends = data?.userFriends
  const addedFriends = friends?.friends || []
  const acceptedFriends = friends?.friendsRelation || []

  const { data: session, status } = useSession()

  const router = useRouter()

  if (status === "loading") return null

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    // TODO: check below code works and add delete friend button
    <PageLayout pageTitle="My Friends">
      <Card className="w-full gap-6 md:w-full lg:w-1/2 xl:flex-row">
        {addedFriends.map((friend, index) => {
          return (
            <>
              <div className="flex items-center gap-6">
                {friend.image && (
                  <Link href={`/${friend.id}`}>
                    <Image
                      alt="Profile Picture"
                      src={friend.image}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </Link>
                )}
                <Link href={`/${friend.id}`}>
                  <span className="font-semibold">{friend.name}</span>
                </Link>
              </div>
              {index + 1 !== addedFriends.length && <hr />}
            </>
          )
        })}
        {acceptedFriends.map((friend) => {
          return (
            <>
              {friend.image && (
                <Image
                  alt="Profile Picture"
                  src={friend.image}
                  width={36}
                  height={36}
                />
              )}
              {friend.name}
            </>
          )
        })}
      </Card>
    </PageLayout>
  )
}

export default MyFriends
