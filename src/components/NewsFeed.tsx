import { useEffect, useState } from "react"
import { trpc } from "../utils/trpc"
import type { RouterInputs } from "../utils/trpc"
import LoadingNF from "./LoadingNF"
import Post from "./Post"

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
          return <Post post={post} key={post.id} />
        })
      )}
      {!hasNextPage && <p className="my-5">You ran out of posts to view!</p>}
    </>
  )
}
