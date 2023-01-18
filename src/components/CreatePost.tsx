import { useState } from "react"
import { z } from "zod"
import { trpc } from "../utils/trpc"

export const postSchema = z.object({
  text: z
    .string({
      required_error: "Post text is required",
    })
    .min(1)
    .max(1000),
})

export function CreatePost() {
  const [text, setText] = useState("")

  const utils = trpc.useContext()

  const { mutateAsync } = trpc.post.create.useMutation({
    onSuccess: () => {
      setText("")
      utils.post.newsfeed.invalidate()
    },
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      postSchema.parse({ text })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error)
      }
      return
    }

    mutateAsync({ text })
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mb-4 mt-10 flex w-full flex-col rounded-md border-2 border-black bg-gradient-to-br from-gray-300 to-gray-200 p-4"
      >
        <textarea
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-md border-2 border-black p-2 text-black"
          value={text}
          placeholder="Create post..."
        />

        <div className="mt-4 flex justify-end">
          <button type="submit" className="navBarButton rounded-md">
            Post
          </button>
        </div>
      </form>
    </>
  )
}
