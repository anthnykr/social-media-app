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

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      setText("")
      utils.post.newsfeed.invalidate()
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      postSchema.parse({ text })
      await createPost.mutateAsync({ text })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error)
      }
      return
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
        <textarea
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2"
          value={text}
          rows={5}
          placeholder="Write post here..."
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-white px-3 py-2 shadow-md hover:shadow-lg"
          >
            Post
          </button>
        </div>
      </form>
    </>
  )
}
