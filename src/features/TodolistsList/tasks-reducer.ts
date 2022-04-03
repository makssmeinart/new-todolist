import {
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from "../../api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "../../app/store";
import { RequestStatusType, setAppStatusAC } from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addTodolistAC,
  removeTodolistAC,
  setTodolistsAC,
} from "./todolists-reducer";

const initialState: TasksStateType = {};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (todolistId: string, thunkApi) => {
    thunkApi.dispatch(setAppStatusAC("loading"));
    try {
      const res = await todolistsAPI.getTasks(todolistId);
      const tasks = res.data.items;
      thunkApi.dispatch(setAppStatusAC("succeeded"));
      return { tasks, todolistId };
    } catch (err: any) {
      handleServerNetworkError(err, thunkApi.dispatch);
    }
  }
);

export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (payload: { taskId: string; todolistId: string }, thunkApi) => {
    thunkApi.dispatch(setAppStatusAC("loading"));
    thunkApi.dispatch(
      updateEntityStatus({
        taskId: payload.taskId,
        todolistId: payload.todolistId,
        value: "loading",
      })
    );
    try {
      const res = await todolistsAPI.deleteTask(
        payload.todolistId,
        payload.taskId
      );
      if (res.data.resultCode === 0) {
        thunkApi.dispatch(setAppStatusAC("succeeded"));
        return {
          taskId: payload.taskId,
          todolistId: payload.todolistId,
        };
      } else {
        handleServerAppError(res.data, thunkApi.dispatch);
      }
    } catch (err: any) {
      handleServerNetworkError(err, thunkApi.dispatch);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTaskAC(
      state,
      action: PayloadAction<{ task: TaskType; todolistId: string }>
    ) {
      state[action.payload.todolistId].unshift(action.payload.task);
    },
    updateTaskAC(
      state,
      action: PayloadAction<{
        taskId: string;
        model: UpdateDomainTaskModelType;
        todolistId: string;
      }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((tk) => tk.id === action.payload.taskId);

      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model };
      }
    },
    updateEntityStatus(
      state,
      action: PayloadAction<{
        taskId: string;
        todolistId: string;
        value: RequestStatusType;
      }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((tk) => tk.id === action.payload.taskId);

      if (index !== 1) {
        tasks[index].entityStatus = action.payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.id] = [];
    });
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload];
    });
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.forEach((tl) => {
        state[tl.id] = [];
      });
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state[action.payload!.todolistId] = action.payload!.tasks;
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const tasks = state[action.payload!.todolistId];
      const index = tasks.findIndex((tk) => tk.id === action.payload!.taskId);

      if (index !== -1) {
        tasks.splice(index, 1);
      }
    });
  },
});

export const tasksReducer = tasksSlice.reducer;

// actions creators
export const addTaskAC = tasksSlice.actions.addTaskAC;
export const updateTaskAC = tasksSlice.actions.updateTaskAC;
export const updateEntityStatus = tasksSlice.actions.updateEntityStatus;

// thunks

export const addTaskTC =
  (title: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"));
    todolistsAPI
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const task = res.data.data.item;
          const action = addTaskAC({ task: task, todolistId: todolistId });
          dispatch(action);
          dispatch(setAppStatusAC("succeeded"));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const updateTaskTC =
  (
    taskId: string,
    domainModel: UpdateDomainTaskModelType,
    todolistId: string
  ) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    let task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn("task not found in the state");
      return;
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };

    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const action = updateTaskAC({
            taskId: taskId,
            model: domainModel,
            todolistId,
          });
          dispatch(action);
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };

// types

export type UpdateDomainTaskModelType = Partial<
  Pick<
    TaskType,
    "title" | "description" | "status" | "priority" | "startDate" | "deadline"
  >
>;
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
