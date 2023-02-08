import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { trpc } from "../utils/trpc"
import Card from "./Card"
import CreateComment from "./CreateComment"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

type Props = {
  postId: string
}
// TODO: delete comment feature
function Comments({ postId }: Props) {
  const { data: comments } = trpc.post.getComments.useQuery({ postId })

  const [showAllComments, setShowAllComments] = useState(false)

  return (
    <Card className="mt-0 gap-2 rounded-t-none bg-gray-100">
      <CreateComment postId={postId} />
      {comments && comments.length > 0 && <div className="mt-4"></div>}

      {comments
        ?.slice(0, showAllComments ? comments.length : 1)
        .map((comment, index) => {
          return (
            <>
              <div key={comment.id} className="flex items-center">
                {comment.author.image && (
                  <Link href={`/${comment.author.id}`}>
                    <Image
                      src={comment.author.image}
                      alt="Profile picture"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </Link>
                )}
                <div className="ml-3 flex flex-col gap-1">
                  {comment.author.name && (
                    <Link href={`/${comment.author.id}`}>
                      <span className="font-semibold">
                        {comment.author.name}
                      </span>
                      <span className="pl-2 text-sm">-</span>
                      <span className="pl-2 text-sm">
                        {dayjs(comment.createdAt).fromNow()}
                      </span>
                    </Link>
                  )}
                  {comment.text}
                </div>
              </div>
              {index + 1 !== comments.length && showAllComments && (
                <hr className="border-gray-300" />
              )}
            </>
          )
        })}
      {!showAllComments && comments && comments.length > 1 ? (
        <span
          onClick={() => setShowAllComments(true)}
          className="mt-4 text-sm text-gray-500 hover:cursor-pointer"
        >
          Show all comments...
        </span>
      ) : showAllComments && comments && comments.length > 1 ? (
        <span
          onClick={() => setShowAllComments(false)}
          className="text-sm text-gray-500 hover:cursor-pointer"
        >
          Show less comments...
        </span>
      ) : (
        ""
      )}
    </Card>
  )
}

export default Comments
