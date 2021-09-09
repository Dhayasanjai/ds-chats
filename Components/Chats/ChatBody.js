import { useState, useEffect, useRef, useCallback } from 'react';
import React from 'react';
import ChatItems from './ChatItems';
import ChatFooter from './ChatFooter';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  getDocs,
} from '@firebase/firestore';

import { db, auth } from '../../config';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
function ChatBody(props) {
  const endOfMessageRef = useRef();
  const [loggedInUser] = useAuthState(auth);
  const route = useRouter();
  const id = route.query.id;
  const [messages, setMessages] = useState(props.messages);
  const scrollToBottom = useCallback(() => {
    endOfMessageRef.current.scrollIntoView({
      behaviour: 'smooth',
      block: 'start',
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(doc(db, 'chats', id), 'messages'),
        orderBy('timestamp', 'asc')
      ),
      (message) => {
        setMessages(message);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [id]);
  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 1000);
  }, [scrollToBottom]);
  return (
    <React.Fragment>
      <main
        style={{ height: 'calc(100vh - 130px)' }}
        className="scroller px-2 overflow-y-scroll overflow-x-hidden chats bg-opacity-10"
      >
        <div className="flex flex-col  gap-2 py-2">
          {messages?.docs?.map((message) => {
            const messageData = message.data();
            return (
              <ChatItems
                scrollToBottom={scrollToBottom}
                key={message.id}
                id={message.id}
                type={messageData.type}
                data={messageData.message}
                isRead={messageData.isRead}
                filename={messageData.filename}
                timestamp={messageData.timestamp?.toDate().getTime()}
                ownText={messageData.user === loggedInUser.email}
              />
            );
          })}
        </div>
        <div className="mt-3" ref={endOfMessageRef}>
          {' '}
        </div>
      </main>

      <ChatFooter scrollToBottom={scrollToBottom} />
    </React.Fragment>
  );
}

export default ChatBody;
