import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./slicers.js/dataSlice";

export default configureStore({
    reducer: {
        expenseData: expenseReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false,
    }),
});