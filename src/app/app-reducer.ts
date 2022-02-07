import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false,
}
export const appSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{error: string | null}>){state.error = action.payload.error},
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>){state.status = action.payload.status},
        setIsInitializedAC(state, action: PayloadAction<{value: boolean}>){state.isInitialized = action.payload.value},
    },
})

// reducer
export const appReducer = appSlice.reducer

// action creators
export const setAppErrorAC = appSlice.actions.setAppErrorAC
export const setAppStatusAC = appSlice.actions.setAppStatusAC
export const setIsInitializedAC = appSlice.actions.setIsInitializedAC

// types

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

