import { AiFillLike } from "react-icons/ai"

function LoadingNF() {
  return (
    <div className="mb-4 flex flex-col rounded-md border-2 border-black p-4">
      <div className="flex h-[36px] w-full items-center gap-3">
        <div className="h-full w-[36px] rounded-full bg-gray-400"></div>
        <div className="h-[30%] w-[25%] rounded-full bg-gray-400"></div>
        <div className="h-[25%] w-[20%] rounded-full bg-gray-300"></div>
      </div>
      <div className="my-5 flex flex-col gap-3">
        <div className="h-[12px] w-full rounded-full bg-gray-400"></div>
        <div className="h-[12px] w-full rounded-full bg-gray-300"></div>
        <div className="h-[12px] w-full rounded-full bg-gray-400"></div>
        <div className="h-[12px] w-full rounded-full bg-gray-300"></div>
      </div>
    </div>
  )
}

export default LoadingNF
