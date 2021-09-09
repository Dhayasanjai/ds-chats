import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from 'moment';
import { Avatar } from '@material-ui/core';
import { auth, db } from '../../config';
import React from 'react';
import { useRouter } from 'next/router';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RemoveRedEyeTwoToneIcon from '@material-ui/icons/RemoveRedEyeTwoTone';
import {
  collection,
  getDocs,
  query,
  getDoc,
  updateDoc,
  doc,
  setDoc,
  serverTimestamp,
  orderBy,
  where,
  onSnapshot,
} from 'firebase/firestore';

function SideBarChatsItems({ id, users }) {
  const router = useRouter();
  const queryId = router.query.id;
  const [user] = useAuthState(auth);
  const [recipientProfileUrl, setRecipientProfileUrl] = useState(null);
  const recipientEmail = users.filter((users) => users !== user.email)[0];
  const recipientName = recipientEmail.split('@')[0];
  const [lastMessage, setLastMessage] = useState(null);
  const enterChat = async () => {
    router.push(`/chat/${id}`).then(() => {});

    if (lastMessage?.user !== user.email) {
      await getDocs(
        query(
          collection(doc(db, 'chats', id), 'messages'),
          where('isRead', '==', false)
        )
      ).then((unreadDocs) => {
        unreadDocs.docs.map((messages) => {
          updateDoc(doc(doc(db, 'chats', id), 'messages', messages.id), {
            isRead: true,
          });
        });
      });
    }
    const userRef = doc(db, 'users', user.uid);

    await setDoc(
      userRef,
      {
        lastSeen: serverTimestamp(),
        routerId: id,
      },
      { merge: true }
    );
  };

  useEffect(() => {
    let controller = new AbortController();
    const sub = getDocs(
      query(collection(db, 'users'), where('email', '==', recipientEmail))
    )
      .then(
        (recipientSnapShot) => recipientSnapShot?.docs?.[0]?.data()?.photoURL
      )
      .then((url) => {
        setRecipientProfileUrl(url);
      });

    return () => controller?.abort(sub);
  }, [recipientEmail]);
  useEffect(() => {
    onSnapshot(
      query(
        collection(doc(db, 'chats', id), 'messages'),
        orderBy('timestamp', 'desc')
      ),

      (snapShot) => {
        const content = snapShot?.docs?.[0]?.data();
        const length = snapShot?.docs?.filter((message) => {
          return message.data().isRead === false;
        }).length;

        if (content?.type === 'text') {
          setLastMessage({
            isRead: content?.isRead,
            length: length,
            user: content?.user,
            message: content.message,
            timestamp: content.timestamp,
          });
        } else if (
          content?.type === 'audio' ||
          content?.type === 'audio/mp3' ||
          content?.type === 'audio/m4r' ||
          content?.type === 'audio/mpeg'
        ) {
          setLastMessage({
            isRead: content?.isRead,
            user: content?.user,
            length: length,
            message: '🎧 Audio',
            timestamp: content.timestamp,
          });
        } else if (
          content?.type === 'image/png' ||
          content?.type === 'image/jpg' ||
          content?.type === 'image/jpeg' ||
          content?.type === 'image/jpeg' ||
          content?.type === 'image/gif'
        ) {
          setLastMessage({
            isRead: content?.isRead,
            user: content?.user,
            message: '📷 Photo',
            length: length,
            timestamp: content.timestamp,
          });
        } else if (content?.type === 'video/mp4') {
          setLastMessage({
            isRead: content?.isRead,
            user: content?.user,
            message: '📽️ Video',
            length: length,
            timestamp: content.timestamp,
          });
        } else {
          setLastMessage({
            isRead: content?.isRead,
            length: length ? length : null,
            user: content?.user,
            message: content?.filename,
            timestamp: content?.timestamp,
          });
        }
      }
    );
  }, [id]);
  return (
    <div
      onClick={enterChat}
      className="flex w-full   align-center py-2 gap-3 items-center border-b border-gray-800 border-opacity-40 hover:bg-yellow-200  "
    >
      {recipientProfileUrl && <Avatar src={recipientProfileUrl} />}
      {!recipientProfileUrl && (
        <Avatar>{recipientEmail[0].toUpperCase()}</Avatar>
      )}

      <div className="w-full">
        <h1 className="font-bold text-xl    text-gray-800  overflow-ellipsis overflow-hidden  whitespace-nowrap	">
          {recipientName[0].toUpperCase() + recipientName.substring(1)}
        </h1>

        <div className="flex gap-2 items-center">
          {lastMessage?.user !== user.email &&
            lastMessage?.length !== 0 &&
            lastMessage?.length && (
              <div className="  bg-pink-600 text-white  rounded-full w-5 h-5 flex items-center justify-center ">
                <p>{lastMessage?.length}</p>
              </div>
            )}
          {lastMessage?.isRead && lastMessage?.user === user.email && (
            <RemoveRedEyeTwoToneIcon
              style={{ fontSize: '12px' }}
              className=" float-right mt-1 ml-1"
            />
          )}
          {!lastMessage?.isRead && lastMessage?.user === user.email && (
            <CheckCircleOutlineIcon
              style={{ fontSize: '12px' }}
              className=" float-right mt-1 ml-1"
            />
          )}
          <p
            className="text-left  whitespace-nowrap text-gray-700	"
            style={{ fontSize: '14px' }}
          >
            {lastMessage?.timestamp &&
              moment(lastMessage?.timestamp?.toDate().getTime()).format('LT')}
          </p>
          <h4 className="text-md overflow-ellipsis overflow-hidden  whitespace-nowrap	 ">
            {lastMessage?.message}
          </h4>
        </div>
      </div>
    </div>
  );
}

export default SideBarChatsItems;
