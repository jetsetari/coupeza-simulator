import { db } from "../";
import { collection, getDocs, doc, getDoc, query, orderBy, where, onSnapshot } from "firebase/firestore";

export const getUserById = async (user_id, callback) => {
    const docRef = doc(db, 'users', user_id);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
        callback({user_id: user_id, ...docSnap.data()} );
    } else {
        callback(false)
    }
};

export const getDocument =  async (coll, id, callback)  =>  {
  const docRef = doc(db, coll, id);
  const docSnap = await getDoc(docRef);
  if(docSnap.exists()) {
      callback(docSnap.data());
  } else {
      callback(false)
  }
}

export const getDeviceById = async (device_id, callback) => {
    const docRef = doc(db, 'devices', device_id);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
        callback({device_id: device_id, ...docSnap.data()} );
    } else {
        callback(false)
    }
};

export const checkConnection = (device_id, callback) => {
    if(device_id){
        const docRef = doc(db, 'devices', device_id);
        const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            callback(data);
          }
        }, (error) => {
            console.log(`Encountered error: ${error}`);
        });
    }   
}