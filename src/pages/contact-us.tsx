import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Card from "../components/Card"

const ContactUs: NextPage = () => {
  const { data: session, status } = useSession()

  const router = useRouter()

  if (status === "loading") return null

  return <Card>Hello</Card>
}

export default ContactUs
