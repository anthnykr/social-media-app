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
  const [uploading, setUploading] = useState(false)

  const getSignedUrl = trpc.profile.getSignedUrl.useMutation().mutateAsync

  const updateAvatarMutation = trpc.profile.updateAvatar.useMutation({
    onSuccess: () => {
      utils.profile.profileInfo.invalidate()
      utils.post.newsfeed.invalidate()
      utils.post.getComments.invalidate()
    },
  }).mutateAsync

  const { data: numFriends } = trpc.profile.getNumFriends.useQuery({
    userId: id,
  })

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

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true)

    const file = e.target.files?.[0]
    // check for file selected
    if (!file) {
      toast.error("No file selected")
      setUploading(false)
      return
    }
    // check for correct file type
    if (
      file.type !== "image/png" &&
      file.type !== "image/jpeg" &&
      file.type !== "image/jpg"
    ) {
      toast.error("Invalid file type")
      setUploading(false)
      return
    }

    try {
      const url = await getSignedUrl({
        name: `${userId}/${file.name}`,
        type: file.type,
      })

      await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      await updateAvatarMutation({ fileName: `${userId}/${file.name}` })
      toast.success("Avatar updated")
    } catch (error) {
      toast.error("Error uploading image")
    }
    setUploading(false)
  }

  return (
    <PageLayout pageTitle="Profile">
      <Card className="items-center gap-6">
        <section className="w-[200px] space-y-2">
          <div className="relative h-[200px] w-[200px]">
            {uploading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <Image src={avatar} alt="Profile Picture" fill />
            )}
          </div>

          {userProfile && (
            <>
              <label
                htmlFor="imageUpload"
                className={`blueButton inline-block w-full py-1 text-center ${
                  showTextarea && `cursor-not-allowed hover:bg-blue-400`
                }`}
              >
                Change Avatar
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/png, image/jpeg, image/jpg"
                onChange={uploadAvatar}
                disabled={showTextarea || uploading}
                hidden
              />
            </>
          )}
          {userProfile && (
            <button
              type="button"
              className={`redButton w-full py-1 ${
                showTextarea && `cursor-not-allowed hover:bg-red-400`
              }`}
              onClick={editBio}
              disabled={showTextarea || loading}
            >
              Edit Bio
            </button>
          )}
          {!userProfile && <FriendButton profileId={id} />}
        </section>

        <section className="flex w-full flex-col items-center gap-6 ">
          <div className="flex gap-40">
            <div className="flex flex-col items-center">
              <p className="text-3xl font-semibold">{userName}</p>
              <p className="text-gray-600">{`${numFriends} ${
                numFriends === 1 ? "Friend" : "Friends"
              }`}</p>
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
                  className="rounded-md border border-gray-300 p-2"
                  value={tempBio}
                  rows={5}
                  cols={85}
                  maxLength={400}
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
