import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Card from "../components/Card"
import { CreatePost } from "../components/CreatePost"

import { NewsFeed } from "../components/NewsFeed"
import PageLayout from "../components/PageLayout"

const Home: NextPage = () => {
  const { data: session, status } = useSession()

  const router = useRouter()

  if (status === "loading") return null

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <PageLayout>
      <Card>
        <CreatePost />
      </Card>
      <Card>
        <NewsFeed />
      </Card>
    </PageLayout>
  )
}

export default Home
