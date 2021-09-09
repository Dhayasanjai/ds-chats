import Avatar from '@material-ui/core/Avatar';
import { IconButton } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import updateTheSeen from '../Lib/updateTheMessageSeen';
import { auth, db } from '../../config';
import { storage } from '../../config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from '@firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
import { onSnapshot, query, where } from '@firebase/firestore';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import TimeAgo from 'timeago-react';
const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));
function ChatHeader({ chat }) {
  const route = useRouter();
  const [user] = useAuthState(auth);
  const [recipient, setRecipient] = useState(null);
  const [loggedInUser] = useAuthState(auth);
  const recipientEmail = chat.users.filter(
    (user) => user != loggedInUser.email
  )[0];
  const recipientName = recipientEmail.split('@')[0];
  useEffect(() => {
    const sub = onSnapshot(
      query(collection(db, 'users'), where('email', '==', recipientEmail)),
      (recipientSnapShot) => {
        setRecipient(recipientSnapShot?.docs?.[0]?.data());
      }
    );
    return () => {
      sub();
    };
  }, [recipientEmail]);
  const fileChangeHandler = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const type = event.target.files[0].type;
    var filename = file.name;

    const storageRef = ref(storage, filename);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      () => {},
      (error) => {
        alert('failed to send ');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          addDoc(collection(doc(db, 'chats', route.query.id), 'messages'), {
            timestamp: serverTimestamp(),
            message: downloadURL,
            type,
            filename,
            isRead: false,
            user: user.email,
          });
        });
      }
    );
    updateTheSeen(route, user);
    setDoc(
      doc(db, 'users', user.uid),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );
    updateDoc(doc(db, 'chats', route.query.id), {
      timestamp: serverTimestamp(),
    });
  };
  const classes = useStyles();

  return (
    <header
      style={{ background: '#76c2b8' }}
      className="flex items-center justify-between  px-2 py-4 gap-4"
    >
      {recipient ? (
        <Avatar className={classes.large} src={recipient.photoURL} />
      ) : (
        <Avatar className={classes.large}>
          {recipientName[0].toUpperCase()}
        </Avatar>
      )}
      <div className="flex flex-col flex-1">
        <p className="chatHeaderName font-bold text-xl  overflow-ellipsis overflow-hidden  whitespace-nowrap ">
          {recipientName[0].toUpperCase() + recipientName.substring(1)}
        </p>

        {recipient ? (
          <p style={{ fontSize: '13px' }}>
            <TimeAgo datetime={recipient.lastSeen.toDate()} />
          </p>
        ) : (
          <p style={{ fontSize: '13px' }}>
            {' '}
            {recipient === null ? 'loading...' : 'lastSeen : unavailable'}
          </p>
        )}
      </div>
      <div className="flex ">
        <div className="relative -left-10 flex items-center justify-center">
          <IconButton className="left-10   " style={{ zIndex: '0' }}>
            <AttachFileIcon className="cursor-pointer" />
          </IconButton>
          <input
            type="file"
            className="opacity-0 h-7 w-9 cursor-pointer"
            onChange={fileChangeHandler}
          ></input>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;
