import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import Card from "../components/Card"
import { NewsFeed } from "../components/NewsFeed"
import Spinner from "../components/Spinner"
import { trpc } from "../utils/trpc"

const Profile: NextPage = () => {
  // Profile id to fetch news feed
  const router = useRouter()
  const id = router.query.id as string

  // Query to obtain the current bio
  const { data } = trpc.profile.profileInfo.useQuery({ userId: id })
  const avatar = data?.image || ""
  const userName = data?.name || ""
  const bio = data?.bio || ""

  const { data: friendData } = trpc.friend.checkFriendship.useQuery()
  const friendList = friendData?.friends
  console.log(friendList)

  // Mutation to update the bio
  const utils = trpc.useContext()

  const bioMutation = trpc.profile.updateBio.useMutation({
    onSuccess: () => {
      setTempBio("")
      setShowTextarea(false)
      utils.profile.profileInfo.invalidate()
    },
  }).mutateAsync

  const [showTextarea, setShowTextarea] = useState(false)
  const [tempBio, setTempBio] = useState("")
  const [loading, setLoading] = useState(false)

  // Obtaining session and pushing to login page if no session
  const { data: session, status } = useSession()

  if (status === "loading") return null

  if (!session) {
    router.push("/login")
  }

  // Checking if it is the user's profile
  const userId = session?.user?.id
  const userProfile = userId === id

  // Function to display the textarea to edit the bio
  const editBio = () => {
    setTempBio(bio)
    setShowTextarea(true)
  }

  // Cancel editing of the bio
  const cancelEdit = () => {
    setShowTextarea(false)
    setTempBio("")
  }

  // Updates the bio in the database
  const updateBio = async () => {
    setLoading(true)
    await bioMutation({ newBio: tempBio })
    setLoading(false)
  }

  const editAvatar = () => {}

  return (
    <div>
      <Card>
        <div className="my-10 rounded-lg shadow-lg">
          <div>
            <Image src={avatar} alt="" width={200} height={200} />
            {userProfile && (
              <form>
                <button
                  className={`editButton ${
                    showTextarea && `hover:bg-gray-300`
                  }`}
                  onClick={editAvatar}
                  disabled={showTextarea}
                >
                  Change Profile Picture
                </button>
              </form>
            )}
            {userProfile && (
              <form>
                <button
                  type="button"
                  className={`editButton ${
                    showTextarea && `hover:bg-gray-300`
                  }`}
                  onClick={editBio}
                  disabled={showTextarea}
                >
                  Edit Bio
                </button>
              </form>
            )}
          </div>

          <div>
            <div>
              <div>
                <p className="text-3xl font-semibold">{userName}</p>
                <p className="text-gray-600">0 Friends</p>
              </div>
              {!userProfile && (
                <button className="navBarButton">Add Friend</button>
              )}
            </div>
          </div>

          <div>
            {loading ? (
              <Spinner />
            ) : showTextarea ? (
              <div className="flex flex-col gap-2">
                <textarea
                  onChange={(e) => {
                    setTempBio(e.target.value)
                  }}
                  className="rounded-lg border-2 border-gray-400 p-2"
                  value={tempBio}
                  placeholder={bio}
                />
                <div className="space-x-3">
                  <button
                    type="button"
                    className="editButton"
                    onClick={cancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="editButton"
                    onClick={updateBio}
                    disabled={loading}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p>{bio}</p>
            )}
          </div>
        </div>
      </Card>

      <div>
        <Card>
          <NewsFeed who={{ id }} />
        </Card>
      </div>
    </div>
  )
}

export default Profile
