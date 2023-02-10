import { useState } from "react"
import { toast } from "react-hot-toast"
import { postSchema } from "../types/post.schema"
import { trpc } from "../utils/trpc"
import Spinner from "./Spinner"

export function CreatePost() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  const utils = trpc.useContext()

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      setText("")
      utils.post.newsfeed.invalidate()
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()

    try {
      postSchema.parse({ text })
      await createPost.mutateAsync({ text })
    } catch (error) {
      toast.error("Error creating post")
    }
    setLoading(false)
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
          disabled={loading}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-[110px] rounded-md bg-white px-3 py-2 shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex gap-2">
                <span>Posting</span> <Spinner />
              </span>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </form>
    </>
  )
}
