import { Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { WaveSpinner } from 'react-spinners-kit';
import MicIcon from '@material-ui/icons/Mic';
import { IconButton } from '@material-ui/core';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import ClearTwoToneIcon from '@material-ui/icons/ClearTwoTone';
import Recorder from 'recorder-js';
import { storage } from '../../config';
import updateTheMessageSeen from '../Lib/updateTheMessageSeen';
import updateLastSeen from '../Lib/updatelastSeen';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@firebase/firestore';
import { db, auth } from '../../config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
function Audio(props) {
  const [user] = useAuthState(auth);
  const route = useRouter();
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    const recorder = await new Recorder(audioContext, {});

    await navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => recorder.init(stream))
      .catch((err) => console.log('Uh oh... unable to get stream...', err));
    setRecorder(recorder);
    await recorder.start().then(() => setIsRecording(true));
  };

  function stopRecording() {
    recorder.stop().then(() => {
      setIsRecording(false);
    });
  }

  const Upload = async () => {
    let blobValue;
    await recorder.stop().then(({ blob, buffer }) => {
      blobValue = blob;
    });
    setIsRecording(false);
    var filename = user.email + new Date().toISOString();

    const storageRef = ref(storage, filename);

    const uploadTask = uploadBytesResumable(storageRef, blobValue);
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
            type: 'audio',
            isRead: false,
            user: user.email,
          });
        });
      }
    );
    updateTheMessageSeen(route, user);
    updateLastSeen(route, user);
  };
  return (
    <div>
      {!isRecording && (
        <IconButton onClick={startRecording}>
          <MicIcon />
        </IconButton>
      )}
      <div className="flex  ">
        {isRecording && (
          <IconButton onClick={stopRecording}>
            {' '}
            <ClearTwoToneIcon
              className="bg-red-600 rounded text-white"
              fontSize="large"
            />
          </IconButton>
        )}
        {isRecording && <WaveSpinner color="gray" size={40} />}
        {isRecording && (
          <IconButton className="text-3xl" onClick={Upload}>
            {' '}
            <CheckOutlinedIcon
              className="bg-green-600 rounded text-white"
              fontSize="large"
            />
          </IconButton>
        )}{' '}
      </div>
    </div>
  );
}

export default Audio;
