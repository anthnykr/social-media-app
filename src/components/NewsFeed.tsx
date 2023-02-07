import Image from "next/image"
import { useEffect, useState } from "react"
import { RouterInputs, RouterOutputs, trpc } from "../utils/trpc"
import { AiOutlineLike, AiFillLike } from "react-icons/ai"
import Link from "next/link"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import LoadingNF from "./LoadingNF"
import Card from "./Card"

dayjs.extend(relativeTime)

function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)

  function handleScroll() {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop
    const scrolled = (winScroll / height) * 100

    setScrollPosition(scrolled)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return scrollPosition
}

function Post({
  post,
}: {
  post: RouterOutputs["post"]["newsfeed"]["posts"][number]
}) {
  const numLikes = post._count.likes
  const hasLiked = post.likes.length > 0
  const [showFullPost, setShowFullPost] = useState(false)
  const [comment, setComment] = useState("")
  const showExpandButtons = post.text.length > 300

  const utils = trpc.useContext()

  const likePost = trpc.post.like.useMutation({
    onSuccess: () => {
      utils.post.newsfeed.invalidate()
    },
  }).mutate

  const unlikePost = trpc.post.unlike.useMutation({
    onSuccess: () => {
      utils.post.newsfeed.invalidate()
    },
  }).mutate

  return (
    <>
      <Card className="rounded-b-none xl:w-2/5">
        <div className="flex items-center">
          <div>
            {post.author.image && (
              <Link href={`/${post.author.id}`}>
                <Image
                  src={post.author.image}
                  alt=""
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </Link>
            )}
          </div>

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

        <div className="my-6 flex flex-col gap-2">
          {post.text.substring(0, 300) +
            (showFullPost ? post.text.substring(300) : "")}
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
            <AiFillLike size={24} />
            {numLikes}
          </div>
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 hover:bg-gray-200"
              onClick={() => {
                if (hasLiked) {
                  unlikePost({ postId: post.id })
                } else {
                  likePost({ postId: post.id })
                }
              }}
            >
              Like
              {hasLiked && <AiFillLike size={24} />}
              {!hasLiked && <AiOutlineLike size={24} />}
            </button>
          </div>
        </div>
      </Card>
      <Card className="mt-0 rounded-t-none bg-gray-100 xl:w-2/5">
        <textarea
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2"
          value={comment}
          placeholder="Write a comment here..."
        />
      </Card>
    </>
  )
}

export function NewsFeed({
  who = {},
}: {
  who?: RouterInputs["post"]["newsfeed"]["who"]
}) {
  const scrollPosition = useScrollPosition()

  const { data, hasNextPage, fetchNextPage, isFetching, isLoading } =
    trpc.post.newsfeed.useInfiniteQuery(
      {
        limit: 5,
        who,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )

  const posts = data?.pages.flatMap((page) => page.posts) ?? []

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage])

  return (
    <>
      {isLoading ? (
        <>
          <LoadingNF />
          <LoadingNF />
          <LoadingNF />
        </>
      ) : (
        posts.map((post) => {
          return <Post key={post.id} post={post} />
        })
      )}
      {!hasNextPage && <p className="my-5">You ran out of posts to view!</p>}
    </>
  )
}
