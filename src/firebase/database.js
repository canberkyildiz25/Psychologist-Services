import { ref, query, orderByKey, limitToFirst, get } from "firebase/database";
import { db } from "./firebase";

export const fetchPsychologists = async (limit) => {
  const q = query(
    ref(db, "psychologists"),
    orderByKey(),
    limitToFirst(limit)
  );
  const snapshot = await get(q);
  if (!snapshot.exists()) return [];

  return Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
};
