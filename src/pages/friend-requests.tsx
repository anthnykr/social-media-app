import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Card from "../components/Card"
import PageLayout from "../components/PageLayout"

const FriendRequests: NextPage = () => {
  const { data: session, status } = useSession()

  const router = useRouter()

  if (status === "loading") return null

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <PageLayout pageTitle="Profile">
      <Card className="w-full gap-6 md:w-full lg:w-1/2 xl:flex-row">Hello</Card>
    </PageLayout>
  )
}

export default FriendRequests
