import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PaginationState {
    currentPage: number;
    itemPerPage: number;
    totalPages?: number;
}


const initialState: PaginationState = {
    currentPage: 1,
    itemPerPage: 5,
    totalPages: 1,
}


const paginationSlice = createSlice({
    name: 'pagination',
    initialState,
    reducers: {
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        setNextPage(state) {
            if (state.currentPage < state.totalPages!) {
                state.currentPage += 1;
            }
        },
        setPrevPage(state) {
            if (state.currentPage > 1) {
                state.currentPage -= 1;
            }
        },
        setTotalPages(state, action: PayloadAction<number>) {
            state.totalPages = action.payload;
        },
        setTotalItems(state, action: PayloadAction<number>) {
            state.itemPerPage = action.payload;
        }
    }
});

export const { setCurrentPage, setNextPage, setPrevPage, setTotalPages, setTotalItems } = paginationSlice.actions;
export default paginationSlice.reducer;