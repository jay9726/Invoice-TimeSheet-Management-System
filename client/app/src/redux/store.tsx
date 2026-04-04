import { configureStore } from "@reduxjs/toolkit";
import auth from '@/redux/slices/authSlice'
import timeSheet from '@/redux/slices/TimeSheetSlice'
import pagination from '@/redux/slices/paginationSlice'
import taskActivity from '@/redux/slices/taskActivitySlice'



export const store = configureStore({
    reducer: {
        auth: auth,
        timeSheet: timeSheet,
        pagination: pagination,
        taskActivity: taskActivity
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
