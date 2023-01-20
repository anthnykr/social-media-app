import Image from "next/image"
import { useEffect, useState } from "react"
import { RouterInputs, RouterOutputs, trpc } from "../utils/trpc"
import { AiOutlineLike, AiFillLike } from "react-icons/ai"
import Link from "next/link"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import LoadingNF from "./LoadingNF"

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
    <div className="mb-4 flex flex-col rounded-md border-2 border-black p-4">
      <div className="flex items-center">
        <div>
          {post.author.image && (
            <Link href={`/${post.author.name}`}>
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

        <div className="ml-2 flex items-center font-semibold">
          {post.author.name && (
            <Link href={`/${post.author.id}`}> {post.author.name} </Link>
          )}
        </div>
        <p className="pl-1 text-sm">- {dayjs(post.createdAt).fromNow()}</p>
      </div>

      <div className="my-5">{post.text}</div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AiFillLike size={24} />
          {numLikes}
        </div>
        <div className="flex justify-end">
          {/* <p className="mr-4 p-2 hover:bg-gray-200">Comment</p> */}
          <button
            className="flex items-center gap-2 p-2 hover:bg-gray-200"
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
    </div>
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
      {!hasNextPage && <p className="mb-5">You ran out of posts to view!</p>}
    </>
  )
}
