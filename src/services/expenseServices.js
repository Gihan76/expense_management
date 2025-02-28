import { addDoc, collection, doc, getDoc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
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
        return null;
    }
};

// fetch realtime expenses
export const fetchExpenses = async (callback) => {
    try {
        let conditions = [where('isDeleted', '==', false)];
        const colRef = collection(db, 'expenses');
        const queryRef = query(colRef, ...conditions);

        const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(data);
        });
        return unsubscribe;
    } catch (error) {
        console.error("Something went wrong while fetching expenses => ",error);
        return () => {};
    }
};

// fetch expenses by id
export const fetchExpensesById = async (docId = null) => {
    try {
        const docRef = doc(db, 'expenses', docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap?.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Something went wrong while fetching expense data for ${docId} => `,error);
        return null;
    }
};


// add setting constants
export const createExpense = async (values = {}) => {
    try {
        const colRef = collection(db, 'expenses');
        const docRef = await addDoc(colRef, {
            title: values?.name,
            category: values?.category,
            ...(values?.notes ? {notes: values?.notes} : {}),
            price: values?.price,
            date: values?.date,
            createdBy: values?.by,
            createdTS: serverTimestamp(),
            isDeleted: false,
        });
        return docRef.id;
    } catch (error) {
        console.error("Something went wrong while adding expense => ",error);
        return;
    }
};

// update expense data
export const updateExpense = async (docId = "", values = {}) => {
    try {
        const docRef = doc(db, 'expenses', docId);
        await updateDoc(docRef, {
            title: values?.name,
            category: values?.category,
            ...(values?.notes ? {notes: values?.notes} : {}),
            price: values?.price,
            date: values?.date,
            modifiedBy: values?.by,
            modifiedTS: serverTimestamp(),
        });
    } catch (error) {
        console.error("Something went wrong while updating expense => ",error);
    }
};

// delete expense (update flag)
export const deleteExpense = async (docId = "") => {
    try {
        const docRef = doc(db, 'expenses', docId);
        await updateDoc(docRef, {
            isDeleted: true,
            deletedTS: serverTimestamp(),
        });
    } catch (error) {
        console.error("Something went wrong while deleting expense => ",error);
    }
};