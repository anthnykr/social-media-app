import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Container } from "../components/Container"
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
      <Head>
        <title>KroTalk</title>
        <meta name="description" content="KroTalk - A social media app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <CreatePost />
        <NewsFeed />
      </Container>
    </>
  )
}

export default Home
