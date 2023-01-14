import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { Container } from "../components/Container"
import { NewsFeed } from "../components/NewsFeed"
import { trpc } from "../utils/trpc"

const Profile: NextPage = () => {
  const { data } = trpc.profile.profileInfo.useQuery()
  const avatar = data?.image || ""
  const userName = data?.name || ""

  const { data: session, status } = useSession()

  const router = useRouter()

  if (status === "loading") return null

  if (!session) {
    router.push("/login")
    return null
  }

  const id = router.query.id as string

  return (
    <>
      <Head>
        <title>KroTalk</title>
        <meta name="description" content="KroTalk - A social media app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div className="m-auto my-10 max-w-4xl border-2 border-black">
          Profile
        </div>
        <Container>
          <NewsFeed who={{ id }} />
        </Container>
      </div>
    </>
  )
}

export default Profile
