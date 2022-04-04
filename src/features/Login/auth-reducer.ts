import {
  authAPI,
  FieldsErrorsType,
  LoginParamsType,
  ServerResultCodeResponse,
} from "../../api/todolists-api";
import { setAppStatusAC, setIsInitializedAC } from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const loginTC = createAsyncThunk<
  undefined,
  LoginParamsType,
  { rejectValue: { errors: Array<string>; fieldsError?: FieldsErrorsType } }
>("auth/login", async (data: LoginParamsType, thunkApi) => {
  const { email, password, rememberMe, captcha } = data;

  thunkApi.dispatch(setAppStatusAC("loading"));

  try {
    const res = await authAPI.login(email, password, rememberMe, captcha);
    if (res.data.resultCode === ServerResultCodeResponse.success) {
      thunkApi.dispatch(setAppStatusAC("succeeded"));
      return;
    } else {
      handleServerAppError(res.data, thunkApi.dispatch);
      return thunkApi.rejectWithValue({
        errors: res.data.messages,
        fieldsError: res.data.fieldsErrors,
      });
    }
  } catch (err: any) {
    const error: AxiosError = err;
    handleServerNetworkError(error, thunkApi.dispatch);
    return thunkApi.rejectWithValue({
      errors: [error.message],
      fieldsError: undefined,
    });
  }
});

export const logoutTC = createAsyncThunk(
  "auth/logout",
  async (payload, thunkApi) => {
    thunkApi.dispatch(setAppStatusAC("loading"));

    try {
      const res = await authAPI.logout();
      if (res.data.resultCode === 0) {
        thunkApi.dispatch(setAppStatusAC("succeeded"));
        return;
      } else {
        handleServerAppError(res.data, thunkApi.dispatch);
      }
    } catch (err: any) {
      const error: AxiosError = err;
      handleServerNetworkError(error, thunkApi.dispatch);
    }
  }
);

export const initializeAppTC = createAsyncThunk(
  "auth/initializedApp",
  async (payload, thunkApi) => {
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === 0) {
        return { isLoggedIn: true };
      } else {
        handleServerAppError(res.data, thunkApi.dispatch);
        return { isLoggedIn: false };
      }
    } catch (err: any) {
      const error: AxiosError = err;
      handleServerNetworkError(error, thunkApi.dispatch);
      return { isLoggedIn: false };
    } finally {
      thunkApi.dispatch(setIsInitializedAC(true));
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC: (
      state,
      action: PayloadAction<{ isLoggedIn: boolean }>
    ) => {
      state.isLoggedIn = action.payload!.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state) => {
      state.isLoggedIn = true;
    });
    builder.addCase(logoutTC.fulfilled, (state) => {
      state.isLoggedIn = false;
    });
    builder.addCase(initializeAppTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
  },
});

// Action Creators

export const authReducer = slice.reducer;
