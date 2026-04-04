import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface timeSheetState {
  timeSheet: string

}

const initialState: timeSheetState = {
  timeSheet: "",
}

const timeSheetSlice = createSlice({
  name: 'timeSheet',
  initialState,
  reducers: {
    setTimeSheet: (state, action: PayloadAction<string>) => {
      state.timeSheet = action.payload
    },
  }
})

export const { setTimeSheet } = timeSheetSlice.actions;
export default timeSheetSlice.reducer;

