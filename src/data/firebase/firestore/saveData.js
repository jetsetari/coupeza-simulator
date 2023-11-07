import { db } from "../";
import { Timestamp } from "firebase/firestore";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { v4 } from 'uuid';


export const createDocument = (coll, data, callback, id = v4(), update = false) => {
  const docRef = doc(db, coll, id);
  getDoc(docRef)
  .then((docSnapshot) => {
    if (docSnapshot.exists()) {
      updateDoc(docRef, data).then(() => {
        callback({ type: 'success', data: data });
      })
      .catch((error) => {
        callback({ type: 'error', data: error });
      });
    } else {
      setDoc(docRef, data).then(() => {
        callback({ type: 'success', data: data });
      })
      .catch((error) => {
        callback({ type: 'error', data: error });
      });
    }
  })
  .catch((error) => {
    callback({ type: 'error', data: error });
  });
};



export function createDevice(device_id, tmp_id) {
  createDocument('devices', { 
    created: Timestamp.now(),
    tmp_id: tmp_id,
    connected: false
  }, () => {}, device_id);
}


export const addClient = (client) => {
  let _client = {
    created: Timestamp.now(),
    firstName: client.name.first,
    lastName: client.name.last,
    countryCode: client.nat,
    location: client.location,
    picture: client.picture,
    gender: client.gender,
    email: client.email,
    dob: client.dob.date
  }
  createDocument('clients', _client, ()=>{})
} 
