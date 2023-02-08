import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"
import Card from "../components/Card"
import PageLayout from "../components/PageLayout"
import { trpc } from "../utils/trpc"

const FriendRequests: NextPage = () => {
  const { data } = trpc.friend.getFriendRequests.useQuery()

  const utils = trpc.useContext()

  // To accept a friend request
  const acceptFriend = trpc.friend.acceptFriend.useMutation({
    onSuccess: () => {
      utils.friend.getFriendRequests.invalidate()
    },
  })
  // To decline a friend request
  const declineFriend = trpc.friend.declineFriend.useMutation({
    onSuccess: () => {
      utils.friend.getFriendRequests.invalidate()
    },
  })

  const { data: session, status } = useSession()

  const router = useRouter()

  if (status === "loading") return null

  if (!session) {
    router.push("/login")
    return null
  }

  const acceptFriendButton = async ({
    requestId,
    profileId,
  }: {
    requestId: string
    profileId: string
  }) => {
    try {
      if (!requestId) {
        toast.error("Something went wrong.")
        return
      } else {
        await acceptFriend.mutateAsync({
          requestId,
          senderId: profileId,
        })
        toast.success("Friend request accepted.")
      }
    } catch (error) {
      toast.error("Something went wrong.")
    }
  }

  const declineFriendButton = async ({ requestId }: { requestId: string }) => {
    try {
      if (!requestId) {
        toast.error("This user has not sent you a request.")
        return
      } else {
        await declineFriend.mutateAsync({
          requestId,
        })
        toast.success("Friend request declined.")
      }
    } catch (error) {
      toast.error("Something went wrong.")
    }
  }

  return (
    <PageLayout pageTitle="Friend Requests">
      <Card className="w-full gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Friend Requests</h1>
          <p className="text-gray-500">
            Here you can see all your friend requests and accept or decline
            them.
          </p>
        </div>
        <hr />
        {data?.map((friendRequest, index) => {
          return (
            <>
              <div className="flex justify-between">
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

                <div className="space-x-6">
                  <button
                    type="button"
                    className="blueButton px-3 py-2"
                    onClick={() =>
                      acceptFriendButton({
                        requestId: friendRequest.id,
                        profileId: friendRequest.senderId,
                      })
                    }
                  >
                    Accept Friend
                  </button>
                  <button
                    type="button"
                    className="redButton px-3 py-2"
                    onClick={() =>
                      declineFriendButton({ requestId: friendRequest.id })
                    }
                  >
                    Decline Friend
                  </button>
                </div>
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
