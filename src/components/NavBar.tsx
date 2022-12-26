import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function NavBar() {
  const { data: session, status } = useSession();

  const isLoggedIn = !!session?.user?.email;
  const displayAuthButtons = status !== "loading";

  const login = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const logout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    // add something to direct to login page if not logged in
    <div className="flex justify-between items-center bg-black px-5 py-3 text-white w-screen">
      <p>KroTalk</p>
      
      <div className="flex items-center">
        <Link href="/" className="navBarButton">News Feed</Link>
        <Link href="/profile" className="navBarButton">Profile</Link>
      </div>

      {!isLoggedIn && displayAuthButtons && (
          <button onClick={login} className="navBarButton">Login</button>
        )}

        {isLoggedIn && displayAuthButtons && (
          <button onClick={logout} className="navBarButton">Logout</button>
        )}
    </div>
  )
}