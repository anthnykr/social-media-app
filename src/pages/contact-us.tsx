import { ErrorMessage } from "@hookform/error-message"
import classNames from "classnames"
import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import Card from "../components/Card"
import FormLabel from "../components/FormLabel"
import PageLayout from "../components/PageLayout"
import type { contactUs } from "../types/contactUs.schema"
import { trpc } from "../utils/trpc"

const ContactUs: NextPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<contactUs>({
    criteriaMode: "all",
  })

  const submitMessage = trpc.contactUs.submitMessage.useMutation({
    onSuccess: () => {
      reset()
    },
  })

  const { status } = useSession()
  if (status === "loading") return null

  const onSubmit = async (data: contactUs) => {
    try {
      await submitMessage.mutateAsync(data)
      toast.success("Message submitted successfully.")
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <PageLayout pageTitle="Profile">
      <Card className="gap-6 xl:flex-row">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <>
            <div className="flex w-full gap-6">
              <div className="mb-6 w-full">
                <div className="flex w-full justify-between">
                  <FormLabel htmlFor={"firstName"}>First Name</FormLabel>
                  <ErrorMessage
                    errors={errors}
                    name={"firstName"}
                    render={({ messages }) =>
                      messages &&
                      Object.entries(messages).map(([type, message]) => (
                        <p
                          className="text-sm font-medium text-red-500"
                          key={type}
                        >
                          {message}
                        </p>
                      ))
                    }
                  />
                </div>
                <input
                  className={classNames(
                    "mt-1 w-full rounded-lg border p-2 shadow",
                    errors.firstName && "border-rose-600"
                  )}
                  placeholder="John"
                  id="firstName"
                  {...register("firstName", {
                    required: "Required",
                  })}
                />
              </div>

              <div className="mb-6 w-full">
                <div className="flex w-full justify-between">
                  <FormLabel htmlFor={"lastName"}>Last Name</FormLabel>
                  <ErrorMessage
                    errors={errors}
                    name={"lastName"}
                    render={({ messages }) =>
                      messages &&
                      Object.entries(messages).map(([type, message]) => (
                        <p
                          className="text-sm font-medium text-red-500"
                          key={type}
                        >
                          {message}
                        </p>
                      ))
                    }
                  />
                </div>
                <input
                  className={classNames(
                    "mt-1 w-full rounded-lg border p-2 shadow",
                    errors.lastName && "border-rose-600"
                  )}
                  placeholder="Smith"
                  id="lastName"
                  {...register("lastName", {
                    required: "Required",
                  })}
                />
              </div>
            </div>

            <div className="mb-6 w-full">
              <div className="flex w-full justify-between">
                <FormLabel htmlFor={"email"}>Email Address</FormLabel>
                <ErrorMessage
                  errors={errors}
                  name={"email"}
                  render={({ messages }) =>
                    messages &&
                    Object.entries(messages).map(([type, message]) => (
                      <p
                        className="text-sm font-medium text-red-500"
                        key={type}
                      >
                        {message}
                      </p>
                    ))
                  }
                />
              </div>
              <input
                className={classNames(
                  "mt-1 w-full rounded-lg border p-2 shadow",
                  errors.email && "border-rose-600"
                )}
                placeholder="email@example.com"
                id="email"
                type="email"
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                  required: "Required",
                })}
              />
            </div>

            <div className="mb-6 w-full">
              <div className="flex w-full justify-between">
                <FormLabel htmlFor={"message"}>Message</FormLabel>
                <ErrorMessage
                  errors={errors}
                  name={"message"}
                  render={({ messages }) =>
                    messages &&
                    Object.entries(messages).map(([type, message]) => (
                      <p
                        className="text-sm font-medium text-red-500"
                        key={type}
                      >
                        {message}
                      </p>
                    ))
                  }
                />
              </div>
              <textarea
                className={classNames(
                  "mt-1 w-full rounded-lg border p-2 shadow",
                  errors.message && "border-rose-600"
                )}
                rows={3}
                placeholder="Your message..."
                id="message"
                {...register("message", {
                  required: "Required",
                })}
              />
            </div>

            <button type="submit" className="blueButton py-2 px-3">
              Submit support request
            </button>
          </>
        </form>
      </Card>
    </PageLayout>
  )
}

export default ContactUs
