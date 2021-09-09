import Head from 'next/head';

import LogoPage from '../Components/Logo/LogoPage';
import SideBar from '../Components/SideBar/SideBar';
export default function Home() {
  return (
    <div className="flex w-screen h-screen overflow-hidden divide-x divide-gray-400">
      <Head>
        <title>DS chats</title>
        <meta name="description" content="Dhaya Sanjai Chats" />
        <link rel="icon" href="Logo.png" />
        <link rel="shortcut icon" href="Logo.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <link
          href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>
      <div
        style={{ background: '#fcde67' }}
        className="bg-gray-100  w-full md:w-1/4 min-h-screen "
      >
        <SideBar />
      </div>
      <LogoPage></LogoPage>
    </div>
  );
}
