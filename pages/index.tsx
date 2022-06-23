import type { NextPage } from 'next'
import Head from 'next/head'
import PostBox from '../components/PostBox'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Capsule</title>
      </Head>

      <PostBox />

    </div>
  )
}

export default Home
