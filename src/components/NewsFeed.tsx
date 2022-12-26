import Image from "next/image";
import { useEffect, useState } from "react";
import { RouterOutputs, trpc } from "../utils/trpc";
import { CreatePost } from "./CreatePost";
import { AiOutlineLike, AiFillLike } from "react-icons/ai"
import Link from "next/link";

function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)

  function handleScroll() {
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop
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
  post
}: {
  post: RouterOutputs['post']['newsfeed']['posts'][number]
}) {
  const [numLikes, setNumLikes] = useState(post._count.likes)
  const [hasLiked, setHasLiked] = useState(post.likes.length)

  const likeMutation = trpc.post.like.useMutation().mutateAsync
  const unlikeMutation = trpc.post.unlike.useMutation().mutateAsync
  
  return (
    <div className="flex flex-col mb-4 p-4 border-2 border-black rounded-md">
      <div className="flex">
        <div>
          {post.author.image && (
            <Link href="/profile" ><Image src={post.author.image} alt="" width={36} height={36} className="rounded-full" /></Link>
          )}
        </div>

        <div className="flex items-center ml-3">
          {post.author.name && (
            <Link href="/profile"> {post.author.name} </Link>
          )}
        </div>
      </div>
      
      <div className="my-5">
        {post.text}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <AiFillLike size={24} />
          { numLikes }
        </div>
        <div className="flex justify-end">
          {/* <p className="mr-4 p-2 hover:bg-gray-200">Comment</p> */}
          <button className="flex gap-2 items-center hover:bg-gray-200 p-2" onClick={() => {
            if (hasLiked > 0) {
              unlikeMutation({ postId: post.id })
              setNumLikes(numLikes - 1)
              setHasLiked(0)
            } else {
              likeMutation({ postId: post.id })
              setNumLikes(numLikes + 1)
              setHasLiked(1)
            }
          }}>
            Like
            { hasLiked > 0 && <AiFillLike size={24} /> }
            { !(hasLiked > 0) && <AiOutlineLike size={24} /> }
          </button>
        </div>
      </div>
    </div>
  )
}

export function NewsFeed() {
  const scrollPosition = useScrollPosition()

  const { data, hasNextPage, fetchNextPage, isFetching } = trpc.post.newsfeed.useInfiniteQuery(
    {
    limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  const posts = data?.pages.flatMap((page) => page.posts) ?? []

  useEffect(() => {
    if(scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage])

  return (
    <div className="mt-10">

      <CreatePost />
      <div className="">
        {posts.map((post) => {
          return (
            <Post key={post.id} post={post} />
          )
        })}

        {!hasNextPage && <p className="mb-5">You ran out of posts to view!</p>}
      </div>
    </div>
  )
}