import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    settings: {},
    expenseFormData: {},
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
    }
});

export const {
    setSettingsData,
    setExpenseFormData
} = dataSlice.actions;

export const getSettings = (state) => state.expenseData.settings;
export const getExpenseFormData = (state) => state.expenseData.expenseFormData;

export default dataSlice.reducer;