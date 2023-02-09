import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-hot-toast"
import Card from "../components/Card"
import FriendButton from "../components/FriendButton"
import { NewsFeed } from "../components/NewsFeed"
import PageLayout from "../components/PageLayout"
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

    try {
      await bioMutation({ newBio: tempBio })
      toast.success("Bio updated")
    } catch (error) {
      toast.error("Error updating bio")
    }
    setLoading(false)
  }

  // TODO: change avatar feature
  const editAvatar = (target: HTMLInputElement) => {
    const newAvatar = target.files?.[0]
    console.log(newAvatar)
  }

  return (
    <PageLayout pageTitle="Profile">
      <Card className="gap-6 xl:flex-row">
        <section className="space-y-2">
          <div className="h-[200px] w-[200px]">
            <Image src={avatar} alt="" width={200} height={200} />
          </div>
          {userProfile && (
            <form>
              <label
                className={`blueButton inline-block w-full py-1 text-center ${
                  showTextarea && `cursor-not-allowed hover:bg-blue-400`
                }`}
                htmlFor="changeAvatar"
              >
                Change Avatar
              </label>
              <input
                type="file"
                id="changeAvatar"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={(event) => editAvatar(event.target)}
                disabled={showTextarea}
              />
            </form>
          )}
          {userProfile && (
            <form>
              <button
                type="button"
                className={`redButton w-full py-1 ${
                  showTextarea && `cursor-not-allowed hover:bg-gray-200`
                }`}
                onClick={editBio}
                disabled={showTextarea}
              >
                Edit Bio
              </button>
            </form>
          )}
          {!userProfile && <FriendButton profileId={id} />}
        </section>

        <section className="flex w-full flex-col gap-6">
          <div className="flex w-full items-center gap-40">
            <div>
              <p className="text-3xl font-semibold">{userName}</p>
              <p className="text-gray-600">0 Friends</p>
              {/* TODO: get number of friends */}
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
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={tempBio}
                  rows={5}
                  maxLength={300}
                  placeholder="Write something about yourself..."
                />
                <div className="space-x-2">
                  <button
                    type="button"
                    className="blueButton px-2 py-1"
                    onClick={updateBio}
                    disabled={loading}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="redButton px-2 py-1"
                    onClick={cancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p>{bio}</p>
            )}
          </div>
        </section>
      </Card>

      <NewsFeed who={{ id }} />
    </PageLayout>
  )
}

export default Profile
