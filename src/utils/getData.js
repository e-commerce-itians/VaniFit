import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

export default async function GetData(collectionName, docId) {
  const ref = doc(db, collectionName, docId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}
