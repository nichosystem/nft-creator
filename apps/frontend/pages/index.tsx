import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>NFT Tools</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
        <html className="h-full bg-gray-50"/>
        <body className="h-full overflow-hidden"/>
      </Head>
      <Layout/>
    </>
  )
}

export default Home
