import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import Card from "../components/Card"
import PageLayout from "../components/PageLayout"
import { trpc } from "../utils/trpc"

const FriendRequests: NextPage = () => {
  const { data } = trpc.friend.getFriendRequests.useQuery()

  const { data: session, status } = useSession()

  const router = useRouter()

  if (status === "loading") return null

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    // TODO: add accept and decline friend request buttons, also add a heading
    <PageLayout pageTitle="Friend Requests">
      <Card className="w-full gap-6 md:w-full lg:w-1/2">
        {data?.map((friendRequest, index) => {
          return (
            <>
              <div className="flex items-center gap-6">
                {friendRequest.senderAvatar && (
                  <Link href={`/${friendRequest.senderId}`}>
                    <Image
                      alt="Profile Picture"
                      src={friendRequest.senderAvatar}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </Link>
                )}
                <Link href={`/${friendRequest.senderId}`}>
                  <span className="font-semibold">
                    {friendRequest.senderName}
                  </span>
                </Link>
              </div>
              {index + 1 !== data.length && <hr />}
            </>
          )
        })}
      </Card>
    </PageLayout>
  )
}

export default FriendRequests
