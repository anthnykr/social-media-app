import React from "react"
import toast, { Toaster } from "react-hot-toast"
import { trpc } from "../utils/trpc"

type Props = {
  profileId: string
}

function FriendButton({ profileId }: Props) {
  const utils = trpc.useContext()

  // To send a friend request
  const addFriend = trpc.friend.addFriend.useMutation({
    onSuccess: () => {
      utils.friend.checkIfRequestSent.invalidate()
    },
  })
  // To check if the user is your friend already
  const { data: friendLists } = trpc.friend.getFriends.useQuery()
  const friendList = friendLists?.friendList
  const friendRelationList = friendLists?.friendRelationList
  const friendStatus =
    friendList?.includes(profileId) || friendRelationList?.includes(profileId)

  // To check if you have sent the user a friend request
  const { data: reqHasBeenSent } = trpc.friend.checkIfRequestSent.useQuery({
    profileId,
  })
  // To check if the user has sent you a friend request
  const { data: reqReceivedCheck } =
    trpc.friend.checkIfRequestReceived.useQuery({ profileId })
  const reqHasBeenReceived = reqReceivedCheck?.reqHasBeenReceived
  const requestId = reqReceivedCheck?.reqId
  // To accept a friend request
  const acceptFriend = trpc.friend.acceptFriend.useMutation({
    onSuccess: () => {
      utils.friend.getFriends.invalidate()
      utils.friend.checkIfRequestReceived.invalidate()
      utils.friend.checkIfRequestSent.invalidate()
    },
  })
  // To decline a friend request
  const declineFriend = trpc.friend.declineFriend.useMutation({
    onSuccess: () => {
      utils.friend.getFriends.invalidate()
      utils.friend.checkIfRequestReceived.invalidate()
      utils.friend.checkIfRequestSent.invalidate()
    },
  })
  // To delete a friend
  const deleteFriend = trpc.friend.deleteFriend.useMutation({
    onSuccess: () => {
      utils.friend.getFriends.invalidate()
    },
  })

  const addFriendButton = async () => {
    await addFriend.mutateAsync({ receiverId: profileId })
    toast.success("Friend request sent.")
  }

  const acceptFriendButton = async () => {
    if (!requestId) {
      toast.error("Something went wrong.")
      return
    } else {
      await acceptFriend.mutateAsync({
        requestId,
        senderId: profileId,
      })
      toast.success("Friend request accepted.")
    }
  }

  const declineFriendButton = async () => {
    if (!requestId) {
      toast.error("This user has not sent you a request.")
      return
    } else {
      await declineFriend.mutateAsync({
        requestId,
      })
      toast.success("Friend request declined.")
    }
  }

  const deleteFriendButton = async () => {
    await deleteFriend.mutateAsync({ profileId })
    toast.success("Friend deleted.")
  }

  return (
    <>
      {friendStatus ? (
        <button className="editButton w-full" onClick={deleteFriendButton}>
          Delete Friend
        </button>
      ) : reqHasBeenReceived ? (
        <>
          <button className="editButton w-full" onClick={acceptFriendButton}>
            Accept Friend
          </button>
          <button className="editButton w-full" onClick={declineFriendButton}>
            Decline Friend
          </button>
        </>
      ) : reqHasBeenSent ? (
        <button className="editButton w-full" disabled>
          Request Pending
        </button>
      ) : (
        <button className="editButton w-full" onClick={addFriendButton}>
          Add Friend
        </button>
      )}
      <Toaster />
    </>
  )
}

export default FriendButton
