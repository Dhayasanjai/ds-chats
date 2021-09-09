import Image from 'next/image';
import Head from 'next/head';
import { MetroSpinner } from 'react-spinners-kit';
import Logo from '../public/Logo.png';
import React from 'react';

function Loading() {
  return (
    <React.Fragment>
      <Head>
        <title>DS Loading</title>
        <meta name="description" content="Dhaya Sanjai Chats" />
        <link rel="icon" href="Logo.png" />
        <link rel="shortcut icon" href="Logo.png" />
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
        className="flex flex-col gap-4 items-center justify-center h-screen pb-20 w-full"
      >
        <Image src={Logo} alt="DS Chats" height="400" width="400"></Image>
        <MetroSpinner size={60} color="#ea4c89" />
      </div>
    </React.Fragment>
  );
}

export default Loading;
