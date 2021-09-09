import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  where,
  doc,
} from 'firebase/firestore';

import { db } from '../../config';
const updateTheSeen = (route, user) => {
  getDocs(
    query(
      collection(doc(db, 'chats', route.query.id), 'messages'),
      orderBy('timestamp', 'desc')
    )
  ).then((snapShot) => {
    if (snapShot?.docs?.[0]?.data().user !== user.email) {
      getDocs(
        query(
          collection(doc(db, 'chats', route.query.id), 'messages'),
          where('isRead', '==', false)
        )
      ).then((unreadDocs) => {
        unreadDocs.docs.map((messages) => {
          console.log(messages.data());
          if (messages.data().user !== user.email) {
            updateDoc(
              doc(doc(db, 'chats', route.query.id), 'messages', messages.id),
              {
                isRead: true,
              }
            );
          }
        });
      });
    }
  });
};
export default updateTheSeen;
