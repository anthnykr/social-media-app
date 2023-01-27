import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Card from "../components/Card"
import { CreatePost } from "../components/CreatePost"

import { NewsFeed } from "../components/NewsFeed"

const Home: NextPage = () => {
  const { data: session, status } = useSession()

  const router = useRouter()

  if (status === "loading") return null

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <>
      <Card className="">
        <CreatePost />
      </Card>
      <Card className="mt-6">
        <NewsFeed />
      </Card>
    </>
  )
}

export default Home
