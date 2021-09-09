import React from 'react';
import ChatHeader from './ChatHeader';

import ChatBody from './ChatBody';

function Chats({ chat, messages }) {
  return (
    <div className="flex flex-col w-screen md:w-3/4 ">
      <ChatHeader chat={chat} />
      <ChatBody messages={JSON.parse(messages)} />
    </div>
  );
}

export default Chats;
