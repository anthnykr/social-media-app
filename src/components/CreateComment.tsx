import React, { useState } from "react"
import { toast } from "react-hot-toast"
import { commentSchema } from "../types/comment.schema"
import { trpc } from "../utils/trpc"

type Props = {
  postId: string
}

function CreateComment({ postId }: Props) {
  const [comment, setComment] = useState("")

  const utils = trpc.useContext()

  const postComment = trpc.post.createComment.useMutation({
    onSuccess: () => {
      setComment("")
      utils.post.getComments.invalidate()
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      commentSchema.parse({ comment })
      await postComment.mutateAsync({ comment, postId })
    } catch (error) {
      toast.error("Error posting comment")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-6">
      <textarea
        onChange={(e) => setComment(e.target.value)}
        className="w-full rounded-md border border-gray-300 p-2"
        value={comment}
        rows={1}
        placeholder="Write a comment here..."
      />
      <button
        type="submit"
        className="rounded-md bg-white px-3 py-2 shadow-md hover:shadow-lg"
      >
        Post
      </button>
    </form>
  )
}

export default CreateComment
