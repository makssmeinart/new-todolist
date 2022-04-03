import React, { useEffect } from "react";
import "./App.css";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "./store";
import { RequestStatusType } from "./app-reducer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import { Menu } from "@mui/icons-material";
import { ErrorSnackbar } from "../components/ErrorSnackbar/ErrorSnackbar";
import { Login } from "../features/Login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageNotFound } from "../components/Common/PageNotFound/PageNotFound";
import {initializeAppTC, logoutTC} from "../features/Login/auth-reducer";
import { PageLoader } from "../components/Common/PageLoader/PageLoader";

type PropsType = {
  demo?: boolean;
};

function App({ demo = false }: PropsType) {
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    (state) => state.auth.isLoggedIn
  );
  const isInitialized = useSelector<AppRootStateType, boolean>(
    (state) => state.app.isInitialized
  );
  const status = useSelector<AppRootStateType, RequestStatusType>(
    (state) => state.app.status
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAppTC());
  }, []);

  const logout = () => {
    dispatch(logoutTC());
  };

  if (!isInitialized) {
    return <PageLoader />;
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          {isLoggedIn && (
            <Button color={"inherit"} onClick={logout}>
              Log Out
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList demo={demo} />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/404"} element={<PageNotFound />} />
          <Route path={"*"} element={<Navigate to={"/404"} />  } />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
