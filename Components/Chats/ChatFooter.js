import { useState, useRef } from 'react';
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core';
import React from 'react';
import updateTheSeen from '../Lib/updateTheMessageSeen';
import Audio from './Audio';
import {
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import updateLastSeen from '../Lib/updatelastSeen';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config';
function ChatFooter(props) {
  const [touchedEmoji, setTouchedEmoji] = useState(false);
  const selectedRef = useRef();
  const [sending, setSending] = useState(false);
  const [user] = useAuthState(auth);
  const route = useRouter();
  const [message, setMessage] = useState('');
  const [send, setSend] = useState(false);
  const focusHandler = () => {};
  const keyStroke = (e) => {
    if (e.target.value.trim().length > 0 && !send) {
      setSend(true);
    }
    if (e.target.value.trim().length === 0) {
      setSend(false);
    }

    setMessage(e.target.value);
  };
  const messageSentHandler = async (e) => {
    e.preventDefault();
    updateTheSeen(route, user);

    if (message && !sending) {
      setSend(true);
      updateLastSeen(route, user);

      await addDoc(collection(doc(db, 'chats', route.query.id), 'messages'), {
        timestamp: serverTimestamp(),
        message,
        type: 'text',
        isRead: false,
        user: user.email,
      });

      setSending(false);
      setSend(false);
      setMessage('');
      props.scrollToBottom();
    }
  };

  return (
    <footer className="bg-gray-100 w-full flex bottom-0 gap-2 py-2 ">
      <select
        ref={selectedRef}
        className="bg-gray-100 text-xl outline-none"
        id="emojis"
        name="emojis"
        onClick={(event) => {
          if (touchedEmoji) {
            setMessage(
              message +
                event.nativeEvent.target[event.nativeEvent.target.selectedIndex]
                  .text
            );
            setTouchedEmoji(false);
            setSend(true);
          }
          if (!touchedEmoji) setTouchedEmoji(true);
        }}
      >
        <option value="😍">😍</option>
        <option value="😂">😂</option>
        <option value="❤️">❤️</option>
        <option value="😊">😊</option>
        <option value="🔥">🔥</option>
        <option value="😏">😏</option>
        <option value="✨">✨</option>
        <option value="🎂">🎂</option>
        <option value="😡">😡</option>
      </select>

      <form className="flex-1 " onSubmit={messageSentHandler}>
        <input
          value={message}
          onChange={keyStroke}
          onFocus={focusHandler}
          placeholder="Type a message"
          type="text"
          className="outline-none  rounded-3xl w-full h-full px-5"
        />
        <button></button>
      </form>
      {send ? (
        <IconButton onClick={messageSentHandler}>
          <SendIcon />
        </IconButton>
      ) : (
        <Audio scrollToBottom={props.scrollToBottom}></Audio>
      )}
    </footer>
  );
}

export default ChatFooter;
