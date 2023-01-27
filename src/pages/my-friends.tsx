import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Card from "../components/Card"
import PageLayout from "../components/PageLayout"

const MyFriends: NextPage = () => {
  const { data: session, status } = useSession()

  const router = useRouter()

  if (status === "loading") return null

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <PageLayout>
      <Card>Hello</Card>
    </PageLayout>
  )
}

export default MyFriends
