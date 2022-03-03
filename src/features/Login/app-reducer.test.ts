import {
    appReducer,
    InitialStateType,
    setAppErrorAC, setAppStatusAC, setIsInitializedAC
} from "../../app/app-reducer";

let initState: InitialStateType

beforeEach(() => {
    initState = {
        status: 'idle',
        error: null,
        isInitialized: false,
    }
})


test("Change current error status", () => {
    const endState = appReducer(initState, setAppErrorAC("Some error"))

    expect(endState.error).toBe("Some error")
})

test("Change current app status", () => {
    const endState = appReducer(initState, setAppStatusAC("loading"))

    expect(endState.status).toBe("loading")
})

test("Change isInitialized value", () => {
    const endState = appReducer(initState, setIsInitializedAC(true))

    expect(endState.isInitialized).toBe(true)
})