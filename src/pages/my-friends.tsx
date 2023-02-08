import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"
import Card from "../components/Card"
import PageLayout from "../components/PageLayout"
import { trpc } from "../utils/trpc"

const MyFriends: NextPage = () => {
  const { data } = trpc.friend.getFriends.useQuery()
  const friends = data?.userFriends
  const addedFriends = friends?.friends || []
  const acceptedFriends = friends?.friendsRelation || []

  const utils = trpc.useContext()

  // To delete a friend
  const deleteFriend = trpc.friend.deleteFriend.useMutation({
    onSuccess: () => {
      utils.friend.getFriends.invalidate()
    },
  })

  const { data: session, status } = useSession()

  const router = useRouter()

  if (status === "loading") return null

  if (!session) {
    router.push("/login")
    return null
  }

  const deleteFriendButton = async ({ profileId }: { profileId: string }) => {
    try {
      await deleteFriend.mutateAsync({ profileId })
      toast.success("Friend deleted.")
    } catch (error) {
      toast.error("Something went wrong.")
    }
  }

  return (
    <PageLayout pageTitle="My Friends">
      <Card className="gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">My Friends</h1>
          <p className="text-gray-500">
            Here you can see all your friends and delete them if needed.
          </p>
        </div>

        <hr />
        {addedFriends.map((friend, index) => {
          return (
            <>
              <div className="flex justify-between">
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

                <button
                  type="button"
                  className="redButton px-3 py-2"
                  onClick={() => deleteFriendButton({ profileId: friend.id })}
                >
                  Delete Friend
                </button>
              </div>
              {index + 1 !== addedFriends.length && <hr />}
            </>
          )
        })}
        {acceptedFriends.map((friend, index) => {
          return (
            <>
              <div className="flex justify-between">
                <div className="flex items-center gap-6">
                  {friend.image && (
                    <Link href={`/${friend.id}`}>
                      <Image
                        alt="Profile Picture"
                        src={friend.image}
                        width={36}
                        height={36}
                      />
                    </Link>
                  )}
                  <Link href={`/${friend.id}`}>
                    <span className="font-semibold">{friend.name}</span>
                  </Link>
                </div>

                <button
                  type="button"
                  className="editButton"
                  onClick={() => deleteFriendButton({ profileId: friend.id })}
                >
                  Delete Friend
                </button>
              </div>
              {index + 1 !== addedFriends.length && <hr />}
            </>
          )
        })}
      </Card>
    </PageLayout>
  )
}

export default MyFriends
