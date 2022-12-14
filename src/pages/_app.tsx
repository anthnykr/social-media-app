import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { Container } from "../components/Container";
import NavBar from "../components/NavBar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main>
        <NavBar />
        <Container>
          <Component {...pageProps} />
        </Container>
      </main>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
