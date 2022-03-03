import {
    authAPI,
    LoginParamsType,
    ServerResultCodeResponse
} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {
    setAppStatusAC,
    setIsInitializedAC
} from "../../app/app-reducer";
import {
    handleServerAppError,
    handleServerNetworkError
} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initState = {
    isLoggedIn: false,
}
const slice = createSlice({
    name: 'auth',
    initialState: initState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer

// action creators

export const setIsLoggedInAC = slice.actions.setIsLoggedInAC

// thunk

export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
    const {email, password, rememberMe, captcha} = data

    dispatch(setAppStatusAC("loading"))

    authAPI.login(email, password, rememberMe, captcha)
        .then(res => {
            if (res.data.resultCode === ServerResultCodeResponse.success) {
                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))

    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const initializeAppTC = () => (dispatch: Dispatch) => {

    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
        .finally(() => {
            dispatch(setIsInitializedAC(true))
        })
}
