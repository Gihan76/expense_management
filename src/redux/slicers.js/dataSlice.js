import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    settings: {},
    expenseEditFormData: {},
}

export const dataSlice = createSlice({
    name: "expenseData",
    initialState: initialState,
    reducers: {
        setSettingsData: (state, action) => {
            state.settings = action.payload;
        },
        setExpenseEditFormData: (state, action) => {
            state.expenseEditFormData = action.payload;
        },
    }
});

export const {
    setSettingsData,
    setExpenseEditFormData
} = dataSlice.actions;

export const getSettings = (state) => state.expenseData.settings;
export const getExpenseEditFormData = (state) => state.expenseData.expenseEditFormData;

export default dataSlice.reducer;