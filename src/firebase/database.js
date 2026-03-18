import { ref, get } from "firebase/database";
import { db } from "./firebase";

export const fetchPsychologists = async () => {
  const snapshot = await get(ref(db, "psychologists"));
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
};
