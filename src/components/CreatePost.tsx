import { useState } from "react"
import { z } from "zod"
import { trpc } from "../utils/trpc"

export const postSchema = z.object({
  text: z.string({
    required_error: "Post text is required",
  }).min(1).max(1000)
})

export function CreatePost() {
  const [text, setText] = useState("")

  const utils = trpc.useContext()

  const { mutateAsync } = trpc.post.create.useMutation({
    onSuccess: () => {
      setText("")
      utils.post.newsfeed.invalidate()
    }
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
      <form onSubmit={handleSubmit} className="flex w-full flex-col rounded-md border-2 border-black p-4 mb-4">
        <textarea onChange={(e) => setText(e.target.value)} className="text-black w-full p-2 rounded-md border-2 border-black" value={text} placeholder="Create post..."/> 

        <div className="mt-4 flex justify-end">
          <button type="submit" className="px-4 py-2 rounded-md border-2 border-black hover:bg-gray-200">Post</button>
        </div>
      </form>
    </>
  )
}