import React, { useState, useEffect } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SideBarChatsItems from './SideBarChatsItems';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import * as EmailValidate from 'email-validator';
import { auth, db } from '../../config';
import Swal from 'sweetalert2';

import {
  addDoc,
  collection,
  query,
  where,
  serverTimestamp,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const SideBarChats = () => {
  const [search, setSearch] = useState(true);
  const [user] = useAuthState(auth);
  const [fetchedSnapshots, setFetchedSnapshots] = useState();
  const [chatSnapshots, setChatSnapshots] = useState(null);
  useEffect(() => {
    const sub = onSnapshot(
      query(
        collection(db, 'chats'),
        where('users', 'array-contains', user.email),
        orderBy('timestamp', 'desc')
      ),

      (snapShots) => {
        setChatSnapshots(snapShots?.docs);
        setFetchedSnapshots(snapShots?.docs);
      }
    );
    return () => {
      sub();
    };
  }, [user]);

  const addNewUserHandler = async () => {
    const chatAlreadyExistHandler = (recipientEmail) => {
      return !!chatSnapshots?.find(
        (chat) =>
          chat.data().users.find((user) => user === recipientEmail)?.length > 0
      );
    };

    Swal.fire({
      text: 'Enter the Email id to start a new chat',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },

      showCancelButton: true,
      confirmButtonText: 'Add Chat',
      showLoaderOnConfirm: true,

      title: 'DS Chats!',
      preConfirm: (input) => {
        if (!input) {
          return Swal.fire({
            title: 'Mail cannot be empty',
            icon: 'warning',
          });
        } else if (input == user.email) {
          return Swal.fire({
            title: "Sorry you can't chat with yourself",
            icon: 'error',
          });
        } else if (chatAlreadyExistHandler(input)) {
          return Swal.fire({
            title: 'Chat Already Exist ',
            icon: 'warning',
          });
        } else if (!EmailValidate.validate(input)) {
          return Swal.fire({
            title: 'invalid email! ',
            text: 'Mail should be in format (example@gmail.com)',
            icon: 'warning',
          });
        } else {
          addDoc(collection(db, 'chats'), {
            users: [user.email, input],
            timestamp: serverTimestamp(),
          });
          return Swal.fire(input, 'Chat successfully created!', 'success');
        }
      },
    });
  };
  const searchHandler = (event) => {
    if (event.target.value === '') {
      setChatSnapshots(fetchedSnapshots);
    } else {
      setChatSnapshots(() => {
        const searchedItems = fetchedSnapshots?.filter((chat) => {
          const recipientEmail = chat
            ?.data()
            ?.users?.filter((users) => users !== user.email)[0];
          const recipientName = recipientEmail.split('@')[0];
          return recipientName.includes(event.target.value);
        });

        return searchedItems;
      });
    }
  };
  return (
    <div>
      <div className="bg-white flex p-2 rounded-lg gap-3 m-2 ">
        {search ? (
          <SearchIcon className="text-gray-500" />
        ) : (
          <ArrowBackIcon className="text-gray-500" />
        )}

        <input
          onFocus={() => {
            setSearch(false);
          }}
          onBlur={() => {
            setSearch(true);
          }}
          onChange={searchHandler}
          type="text"
          placeholder="search or start a new chat"
          className="flex-1 outline-none overflow-hidden overflow-ellipsis whitespace-nowrap"
        />
      </div>
      <div
        style={{ height: 'calc(100vh - 140px)' }}
        className=" px-2 overflow-y-scroll overflow-x-hidden "
      >
        <div
          onClick={addNewUserHandler}
          className="mr-3 py-1 text-center text-2xl font-bold text-gray-800 border-b border-gray-600 border-opacity-20 hover:bg-yellow-100 rounded-lg  pr-4 flex items-center "
        >
          <AddCircleOutlinedIcon
            style={{ fontSize: '3rem' }}
            className="text-gray-600"
          />

          <p className="overflow-ellipsis overflow-hidden  whitespace-nowrap w-10/12">
            Add a new Chat
          </p>
        </div>
        {chatSnapshots?.map((chat) => (
          <SideBarChatsItems
            key={chat.id}
            id={chat.id}
            users={chat.data().users}
          />
        ))}
      </div>
    </div>
  );
};

export default SideBarChats;
