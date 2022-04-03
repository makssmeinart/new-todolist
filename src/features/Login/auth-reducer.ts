import {
  authAPI, FieldsErrorsType,
  LoginParamsType,
  ServerResultCodeResponse,
} from "../../api/todolists-api";
import { Dispatch } from "redux";
import { setAppStatusAC, setIsInitializedAC } from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const loginTC = createAsyncThunk<
  { isLoggedIn: boolean },
  LoginParamsType,
  { rejectValue: {errors: Array<string>, fieldsError?: FieldsErrorsType}}
>("auth/login", async (data: LoginParamsType, thunkApi) => {
  const { email, password, rememberMe, captcha } = data;

  thunkApi.dispatch(setAppStatusAC("loading"));

  try {
    const res = await authAPI.login(email, password, rememberMe, captcha);
    if (res.data.resultCode === ServerResultCodeResponse.success) {
      thunkApi.dispatch(setAppStatusAC("succeeded"));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, thunkApi.dispatch);
      debugger;
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

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));

  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC("succeeded"));
        dispatch(setIsLoggedInAC({ isLoggedIn: false }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch);
    });
};

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch);
    })
    .finally(() => {
      dispatch(setIsInitializedAC(true));
    });
};

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
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
  },
});

// Action Creators

export const setIsLoggedInAC = slice.actions.setIsLoggedInAC;

export const authReducer = slice.reducer;
