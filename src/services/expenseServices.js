import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../config/firebase";

// fetch setting constants
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
        console.error("Something went wrong while fetching settings data => ",error);
    }
};

// add setting constants
export const createExpense = async (values = {}) => {
    try {
        const colRef = collection(db, 'expenses');
        const docRef = await addDoc(colRef, {
            title: values?.name,
            category: values?.category,
            ...(values?.amount ? {amount: values?.amount} : {}),
            price: values?.price,
            date: values?.date,
            createdBy: values?.by,
            createdTS: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Something went wrong while adding expense => ",error);
    }
};

export const fetchExpenses = async (range = {}) => {
    try {
        let conditions = [];
        if(range?.fromDate){
            conditions.push(where('date', '>=', range?.fromDate));
        }
        if(range?.toDate){
            conditions.push(where('date', '<=', range?.toDate));
        }
        const colRef = collection(db, 'expenses');
        const queryRef = query(colRef, ...conditions);
        const querySnapshot = await getDocs(queryRef);
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return data;
    } catch (error) {
        console.error("Something went wrong while fetching expenses => ",error);
    }
};