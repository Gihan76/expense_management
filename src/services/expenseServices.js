import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const fetchConstants = async () => {
    try {
        const docRef = doc(db, 'settings', 'constants');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap?.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
    }
};