import {
    addTaskAC,
    removeTaskAC, setTasksAC,
    tasksReducer,
    TasksStateType,
    updateTaskAC
} from "../tasks-reducer";
import {
    TaskPriorities,
    TaskStatuses,
    TaskType, TodolistType
} from "../../../api/todolists-api";
import {RequestStatusType} from "../../../app/app-reducer";
import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC
} from "../todolists-reducer";

let initState: TasksStateType

beforeEach(() => {
    initState = {
        "todolistId1": [
            {
                title: "Task1",
                description: "",
                id: "task1",
                todoListId: "todolistId1",
                status: TaskStatuses.New,
                startDate: "",
                entityStatus: "idle",
                priority: TaskPriorities.Low,
                addedDate: "",
                deadline: "",
                order: 0,
            },
            {
                title: "Task2",
                description: "",
                id: "task2",
                todoListId: "todolistId1",
                status: TaskStatuses.New,
                startDate: "",
                entityStatus: "idle",
                priority: TaskPriorities.Low,
                addedDate: "",
                deadline: "",
                order: 0,
            },
            {
                title: "Task3",
                description: "",
                id: "task3",
                todoListId: "todolistId1",
                status: TaskStatuses.New,
                startDate: "",
                entityStatus: "idle",
                priority: TaskPriorities.Low,
                addedDate: "",
                deadline: "",
                order: 0,
            },
        ],
        "todolistId2": [
            {
                title: "Task1",
                description: "",
                id: "task1",
                todoListId: "todolistId2",
                status: TaskStatuses.New,
                startDate: "",
                entityStatus: "idle",
                priority: TaskPriorities.Low,
                addedDate: "",
                deadline: "",
                order: 0,
            },
            {
                title: "Task1",
                description: "",
                id: "task2",
                todoListId: "todolistId2",
                status: TaskStatuses.New,
                startDate: "",
                entityStatus: "idle",
                priority: TaskPriorities.Low,
                addedDate: "",
                deadline: "",
                order: 0,
            },
            {
                title: "Task3",
                description: "",
                id: "task3",
                todoListId: "todolistId2",
                status: TaskStatuses.New,
                startDate: "",
                entityStatus: "idle",
                priority: TaskPriorities.Low,
                addedDate: "",
                deadline: "",
                order: 0,
            },
        ]
    }
})

test("Correct task should be deleted" +
    " from the correct todolist", () => {
    const action =
        removeTaskAC({taskId: "task2", todolistId: "todolistId2"})

    const endState = tasksReducer(initState, action)

    expect(endState["todolistId1"].length).toBe(3)
    expect(endState["todolistId2"].length).toBe(2)
    expect(endState["todolistId2"].every(t => t.id !== "task2")).toBeTruthy()
})

test("Add new task to correct todolist", () => {
    const newTask: TaskType = {
        title: "Task4",
        description: "",
        id: "task4",
        todoListId: "todolistId1",
        status: TaskStatuses.New,
        startDate: "",
        entityStatus: "idle",
        priority: TaskPriorities.Low,
        addedDate: "",
        deadline: "",
        order: 0,
    }

    const action = addTaskAC({task: newTask, todolistId: "todolistId1"})

    const endResult = tasksReducer(initState, action)


    expect(endResult["todolistId1"].length).toBe(4)
    expect(endResult["todolistId1"].some(t => t.id === "task4")).toBeTruthy()
    expect(endResult["todolistId2"].length).toBe(3)
})

test("Update correct status on task", () => {
    const action = updateTaskAC({
        taskId: "task1",
        todolistId: "todolistId1",
        model: {status: TaskStatuses.Completed}
    })

    const endState = tasksReducer(initState, action)

    expect(endState["todolistId1"][0].status).toBe(TaskStatuses.Completed)
    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.New)
})

test("Update correct title on task", () => {
    const action = updateTaskAC({
        taskId: "task1",
        todolistId: "todolistId1",
        model: {title: "New title"}
    })

    const endState = tasksReducer(initState, action)

    expect(endState["todolistId1"][0].title).toBe("New title")
    expect(endState["todolistId1"][1].title).toBe("Task2")
})

test("Update correct description on task", () => {
    const action = updateTaskAC({
        taskId: "task2",
        todolistId: "todolistId1",
        model: {description: "Hello world"}
    })

    const endState = tasksReducer(initState, action)

    expect(endState["todolistId1"][0].description).toBe("")
    expect(endState["todolistId1"][1].description).toBe("Hello world")
})

test("New array should be added when new todolist is added", () => {
    const action = addTodolistAC({
        id: "todolistId3",
        title: "Todolist3",
        entityStatus: "idle",
        order: 0,
        addedDate: "",
    })

    const endState = tasksReducer(initState, action)

    const keys = Object.keys(endState) // 3
    const newKey = keys.find(k => k !== "todolistId1" && k !== "todolistId2")

    if (!newKey) {
        throw Error("Key is not found ")
    }
})

test("If todolist was deleted array should be deleted too", () => {
        const todolistId = "todolistId1"
        const action = removeTodolistAC(todolistId)

        const endState = tasksReducer(initState, action)

        const keys = Object.keys(endState)
        const deletedItem = keys.find(k => k === todolistId)

        if (deletedItem) {
            throw Error("Item hasn't been deleted")
        }
    }
)


test("Empty array should be added when we set todolist", () => {
    const action = setTodolistsAC([
        {
            id: "todolistId1",
            title: "Todolist1",
            order: 0,
            addedDate: "",
            entityStatus: "idle",
        },
        {
            id: "todolistId2",
            title: "Todolist2",
            order: 0,
            addedDate: "",
            entityStatus: "idle",
        }
    ])

    const endState = tasksReducer({}, action)
    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState["todolistId1"]).toBeDefined()

})