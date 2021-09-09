import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config';

const updateLastSeen = (route, user) => {
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
export default updateLastSeen;
