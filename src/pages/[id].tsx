import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import { Container } from "../components/Container"
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
    <>
      <Head>
        <title>KroTalk</title>
        <meta name="description" content="KroTalk - A social media app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div className="m-auto my-10 grid max-w-4xl grid-cols-[200px_auto] grid-rows-[40%_60%] rounded-md border-2 border-black p-10">
          <div className="row-span-2 space-y-2">
            <Image
              src={avatar}
              alt=""
              width={200}
              height={200}
              className="border-2 border-gray-500"
            />
            {userProfile && (
              <form className="w-full">
                <button
                  className={`editButton w-full ${
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
              <form className="w-full">
                <button
                  type="button"
                  className={`editButton w-full ${
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

          <div className="">
            <div className="flex h-full w-full items-center justify-between pl-[60px] pr-[40px]">
              <div>
                <p className="text-3xl font-semibold">{userName}</p>
                <p className="text-gray-600">0 Friends</p>
              </div>
              {!userProfile && (
                <button className="navBarButton">Add Friend</button>
              )}
            </div>
          </div>

          <div className="h-full w-full pl-[60px] pr-[40px]">
            {loading ? (
              <Spinner />
            ) : showTextarea ? (
              <div className="flex flex-col gap-2">
                <textarea
                  onChange={(e) => {
                    setTempBio(e.target.value)
                  }}
                  className="rounded-md border-2 border-gray-400 p-2"
                  value={tempBio}
                  placeholder={bio}
                />
                <div className="space-x-3">
                  <button
                    type="button"
                    className="editButton w-[20%]"
                    onClick={cancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="editButton w-[20%]"
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

        <Container>
          <NewsFeed who={{ id }} />
        </Container>
      </div>
    </>
  )
}

export default Profile
