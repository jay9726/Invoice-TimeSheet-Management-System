import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface stateProps {
    workDate: string,
    taskActivityName: string,
    clientId: string,
    projectId: string,
    clientName?: string,
    projectName?: string,
    startTime: string,
    endTime: string,
    hoursWorked: number,
    isBillable: boolean,
    notes: string
}

interface initialProps {
    taskActivity: stateProps[]
}

const initialState: initialProps = {
    taskActivity: []
}

const taskActivitySlice = createSlice({
    name: 'taskActivity',
    initialState,
    reducers: {
        addLog: (state, action: PayloadAction<stateProps>) => {
            state.taskActivity.push(action.payload)
        }, 
        clearAllLog: (state) => {
            state.taskActivity = []
        }
    }
})

export const { addLog, clearAllLog } = taskActivitySlice.actions;
export default taskActivitySlice.reducer;