import { type NextPage } from "next";
import Head from "next/head";

import { NewsFeed } from "../components/NewsFeed";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>KroTalk</title>
        <meta name="description" content="KroTalk - A social media app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NewsFeed />
    </>
  );
};

export default Home;