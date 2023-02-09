import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { toast } from "react-hot-toast"
import { AiFillLike, AiOutlineLike } from "react-icons/ai"
import { RxCross1 } from "react-icons/rx"
import { trpc } from "../utils/trpc"
import type { RouterOutputs } from "../utils/trpc"
import Card from "./Card"
import Comments from "./Comments"

dayjs.extend(relativeTime)

type Props = {
  post: RouterOutputs["post"]["newsfeed"]["posts"][number]
}

function Post({ post }: Props) {
  const [showFullPost, setShowFullPost] = useState(false)

  const userId = useSession().data?.user?.id

  const numLikes = post._count.likes
  const hasLiked = post.likes.length > 0
  const showExpandButtons = post.text.length > 500

  const utils = trpc.useContext()

  const likePost = trpc.post.like.useMutation({
    onSuccess: () => {
      utils.post.newsfeed.invalidate()
    },
  })

  const unlikePost = trpc.post.unlike.useMutation({
    onSuccess: () => {
      utils.post.newsfeed.invalidate()
    },
  })

  const deletePostMutation = trpc.post.deletePost.useMutation({
    onSuccess: () => {
      utils.post.newsfeed.invalidate()
    },
  })

  const deletePost = async () => {
    try {
      await deletePostMutation.mutateAsync({ postId: post.id })
      toast.success("Post deleted")
    } catch (error) {
      toast.error("Error deleting post")
    }
  }

  return (
    <>
      <Card className="mt-6 rounded-b-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {post.author.image && (
              <Link href={`/${post.author.id}`}>
                <Image
                  src={post.author.image}
                  alt="Profile picture"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </Link>
            )}

            <div className="ml-3 flex items-center font-semibold">
              {post.author.name && (
                <Link href={`/${post.author.id}`}> {post.author.name} </Link>
              )}
            </div>
            <span className="pl-2 text-sm">-</span>
            <span className="pl-2 text-sm">
              {dayjs(post.createdAt).fromNow()}
            </span>
          </div>

          {post.author.id === userId && (
            <RxCross1
              onClick={deletePost}
              className="cursor-pointer text-red-400"
            />
            // TODO: add a modal confirmation for deletion (idea - x button shows confirm/cancel buttons which trigger deletePost mutation)
          )}
        </div>

        <div className="my-6 flex flex-col gap-2">
          {post.text.substring(0, 500) +
            (showFullPost ? post.text.substring(500) : "")}
          {!showFullPost && showExpandButtons ? (
            <span
              onClick={() => setShowFullPost(true)}
              className="text-sm text-gray-500 hover:cursor-pointer"
            >
              Show more...
            </span>
          ) : showFullPost && showExpandButtons ? (
            <span
              onClick={() => setShowFullPost(false)}
              className="text-sm text-gray-500 hover:cursor-pointer"
            >
              Show less...
            </span>
          ) : (
            ""
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AiFillLike size={24} color="blue" />
            {numLikes}
          </div>
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 hover:bg-gray-200"
              onClick={async () => {
                if (hasLiked) {
                  await unlikePost.mutateAsync({ postId: post.id })
                } else {
                  await likePost.mutateAsync({ postId: post.id })
                }
              }}
            >
              Like
              {hasLiked && <AiFillLike size={24} color="blue" />}
              {!hasLiked && <AiOutlineLike size={24} />}
            </button>
          </div>
        </div>
      </Card>

      <Comments postId={post.id} />
    </>
  )
}

export default Post
