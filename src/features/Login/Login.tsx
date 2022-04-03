import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { loginTC } from "./auth-reducer";
import { LoginParamsType } from "../../api/todolists-api";
import { AppRootStateType, useAppDispatch } from "../../app/store";
import { Navigate } from "react-router-dom";

export const Login = () => {
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    (state) => state.auth.isLoggedIn
  );
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: Partial<
        Pick<LoginParamsType, "rememberMe" | "password" | "email">
      > = {};
      if (!values.email) {
        errors.email = "Email is required!";
      }
      if (!values.password) {
        errors.password = "Password is required!";
      } else if (values.password.length < 3) {
        errors.password = "Password should contain at least 3 characters.";
      }
      return errors;
    },
    onSubmit: async (values, formikHelpers) => {
      const action = await dispatch(loginTC(values));
      if (loginTC.rejected.match(action)) {
        if (action.payload?.fieldsError?.length) {
          const error = action.payload.fieldsError[0];

          formikHelpers.setFieldError(error.field, error.error);
        }
      }
      debugger;
    },
  });

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <FormControl>
          <FormLabel>
            <p>
              To log in get registered
              <a
                href={"https://social-network.samuraijs.com/"}
                target={"_blank"}
              >
                {" "}
                here
              </a>
            </p>
            <p>
              Email: <strong>free@samuraijs.com</strong>
            </p>
            <p>
              Password: <strong>free</strong>
            </p>
          </FormLabel>
          <form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <div style={{ color: "red" }}>{formik.errors.email}</div>
              )}
              <TextField
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              )}
              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox {...formik.getFieldProps("rememberMe")} />}
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </form>
        </FormControl>
      </Grid>
    </Grid>
  );
};
