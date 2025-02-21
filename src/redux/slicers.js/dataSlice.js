import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    settings: {},
    expenseFormData: {},
    isUserLoggedIn: false,
    loggedUserData: null,
}

export const dataSlice = createSlice({
    name: "expenseData",
    initialState: initialState,
    reducers: {
        setSettingsData: (state, action) => {
            state.settings = action.payload;
        },
        setExpenseFormData: (state, action) => {
            state.expenseFormData = action.payload;
        },
        setIsUserLoggedIn: (state, action) => {
            state.isUserLoggedIn = action.payload;
        },
        setLoggedUserData: (state, action) => {
            state.loggedUserData = action.payload;
        },
    }
});

export const {
    setSettingsData,
    setExpenseFormData,
    setIsUserLoggedIn,
    setLoggedUserData,
} = dataSlice.actions;

export const getSettings = (state) => state.expenseData.settings;
export const getExpenseFormData = (state) => state.expenseData.expenseFormData;
export const getIsUserLoggedIn = (state) => state.expenseData.isUserLoggedIn;
export const getLoggedUserData = (state) => state.expenseData.loggedUserData;

export default dataSlice.reducer;