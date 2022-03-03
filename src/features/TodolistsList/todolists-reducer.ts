import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []
const todolistSlice = createSlice({
    name: "todolist",
    initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<string>) {
            const index = state.findIndex(tl => tl.id === action.payload)
            if (index !== -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC(state, action: PayloadAction<TodolistType>) {
            state.unshift({
                ...action.payload,
                filter: "all",
            })
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ todolistId: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index !== -1) {
                state[index].title = action.payload.title
            }
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index !== -1) {
                state[index].filter = action.payload.filter
            }
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index !== -1) {
                state[index].entityStatus = action.payload.status
            }
        },
        setTodolistsAC(state, action: PayloadAction<TodolistType[]>) {
            return action.payload.map(tl => ({
                ...tl,
                filter: "all",
                entityStatus: "idle"
            }))
        },
    }
})

// reducer

export const todolistsReducer = todolistSlice.reducer

// action creators

export const removeTodolistAC = todolistSlice.actions.removeTodolistAC
export const addTodolistAC = todolistSlice.actions.addTodolistAC
export const changeTodolistTitleAC = todolistSlice.actions.changeTodolistTitleAC
export const changeTodolistFilterAC = todolistSlice.actions.changeTodolistFilterAC
export const changeTodolistEntityStatusAC = todolistSlice.actions.changeTodolistEntityStatusAC
export const setTodolistsAC = todolistSlice.actions.setTodolistsAC

// thunks
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setAppStatusAC( 'succeeded'))
            })
            .catch((err) => {
                handleServerNetworkError(err, dispatch)
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(setAppStatusAC('loading'))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(changeTodolistEntityStatusAC({
            todolistId: todolistId,
            status: 'loading'
        }))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(removeTodolistAC(todolistId))
                //скажем глобально приложению, что асинхронная операция завершена
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC({todolistId: id, title: title}))
            })
    }
}

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
