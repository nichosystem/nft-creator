import Head from "next/head";
import Link from "next/link";
import { Layout, NextPageWithLayout } from "../types/types";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <h1>Homepage</h1>
      <Link href="/dapp">ENTER DAPP</Link>
    </>
  );
};

const Layout: Layout = ({ children }) => {
  return <div>{children}</div>;
};

Home.Layout = Layout;
export default Home;
