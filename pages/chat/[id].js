import Head from 'next/head';
import Chats from '../../Components/Chats/Chats';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config';
import React from 'react';
import SideBar from '../../Components/SideBar/SideBar';
import {
  collection,
  getDocs,
  orderBy,
  doc,
  getDoc,
  query,
} from 'firebase/firestore';
import SelectedImage from '../../Components/SelectedImage';
import { useSelector } from 'react-redux';
function Chat({ chat, messages }) {
  const photoModal = useSelector((state) => state);

  const [loggedInUser] = useAuthState(auth);

  const recipientEmail = JSON.parse(chat).users.filter(
    (user) => user !== loggedInUser.email
  )[0];
  const recipientName = recipientEmail.split('@')[0];
  return (
    <React.Fragment>
      {' '}
      <Head>
        <title>
          Chat with{' '}
          {recipientName[0].toUpperCase() + recipientName.substring(1)}{' '}
        </title>
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
      {photoModal.showModal && <SelectedImage />}
      <div className="flex w-full h-screen overflow-hidden divide-x divide-gray-400">
        <div
          style={{ background: '#fcde67' }}
          className="hidden md:block  w-full md:w-1/4 min-h-screen "
        >
          <SideBar />
        </div>
        <Chats messages={messages} chat={JSON.parse(chat)} />
      </div>
    </React.Fragment>
  );
}
export default Chat;

export async function getServerSideProps(context) {
  const ref = doc(db, 'chats', context.query.id);
  const messageRes = await getDocs(
    query(collection(ref, 'message'), orderBy('timestamp', 'asc'))
  );
  const message = messageRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((message) => {
      ({ ...message, timeStamp: message.timeStamp.toDate().getTime() });
    });
  const chatRes = await getDoc(ref);
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(message),
      chat: JSON.stringify(chat),
    },
  };
}
