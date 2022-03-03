import {v1} from "uuid"
import {
    addTodolistAC,
    changeTodolistEntityStatusAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    setTodolistsAC,
    TodolistDomainType,
    todolistsReducer
} from "../todolists-reducer";

let todolistId1: string
let todolistId2: string
let initState: TodolistDomainType[]

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    initState = [
        {
            id: todolistId1,
            entityStatus: "idle",
            title: "TD1",
            addedDate: "",
            order: 0,
            filter: "all",
        },
        {
            id: todolistId2,
            entityStatus: "idle",
            title: "TD2",
            addedDate: "",
            order: 0,
            filter: "all",
        },
    ]
})

test("Correct todolist should be removed", () => {
    const action = removeTodolistAC(todolistId1)

    const endState = todolistsReducer(initState, action)

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test("Correct todolist should be added", () => {
    const todolistId3 = v1()

    const action = addTodolistAC({
        id: todolistId3,
        title: "TD3",
        addedDate: "",
        order: 0,
        entityStatus: "idle",
    })

    const endState = todolistsReducer(initState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].id).toBe(todolistId3)
    expect(endState[0].filter).toBe("all")
})

test("Correct todolist should change its title", () => {
    const action = changeTodolistTitleAC({
        todolistId: todolistId2,
        title: "New title"
    })

    const endState = todolistsReducer(initState, action)

    expect(endState[0].title).toBe("TD1")
    expect(endState[1].title).toBe("New title")
})

test("Correct todolist should change its filter", () => {
    const action = changeTodolistFilterAC({
        todolistId: todolistId1,
        filter: "completed"
    })

    const endState = todolistsReducer(initState, action)

    expect(endState[0].filter).toBe("completed")
    expect(endState[1].filter).toBe("all")
})

test("Set fetched todolist", () => {
    const action = setTodolistsAC([
        {
            id: todolistId1,
            title: "Test1",
            entityStatus: "idle",
            order: 0,
            addedDate: "",
        },
        {
            id: todolistId2,
            title: "Test2",
            entityStatus: "idle",
            order: 0,
            addedDate: "",
        }
    ])

    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})

test("Correct entity status should be changed", () => {
    const action = changeTodolistEntityStatusAC({
        todolistId: todolistId1,
        status: "loading",
    })

    const endState = todolistsReducer(initState, action)

    expect(endState[0].entityStatus).toBe("loading")
    expect(endState[1].entityStatus).toBe("idle")
})