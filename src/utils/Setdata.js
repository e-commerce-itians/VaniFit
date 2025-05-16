import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore();

export default async function Setdata(
  collectionName,
  docId,
  data,
  merge = true
) {
  const ref = doc(db, collectionName, docId);
  await setDoc(ref, data, { merge });
}
