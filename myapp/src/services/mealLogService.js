import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// Document path: mealLogs/{userId}_{date}
function docRef(userId, date) {
    return doc(db, "mealLogs", `${userId}_${date}`);
}

export async function loadMealLog(userId, date) {
    if (!userId || !date) return null;
    const snap = await getDoc(docRef(userId, date));
    return snap.exists() ? snap.data() : null;
}

export async function saveMealLog(userId, date, meals) {
    if (!userId || !date) return;
    await setDoc(docRef(userId, date), meals);
}