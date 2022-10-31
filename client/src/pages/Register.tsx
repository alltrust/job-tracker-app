import React, { useState, useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { Logo, FormRow, Alert } from "../components/Index";
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppContext } from "../context/appContext";

interface User {
  name: string;
  email: string;
  password: string;
  isMember: boolean;
}

const initialValue: User = {
  name: "",
  email: "",
  password: "",
  isMember: false,
};

const Register = (): JSX.Element => {
  const [value, setValue] = useState<User>(initialValue);
  const { email, password, isMember, name } = value;

  const {
    isLoading,
    showAlert,
    displayAlert,
    clearAlert,
    user,
    setUpUser,
  } = useAppContext();

  const navigate: NavigateFunction = useNavigate();

  const handleChange = (
    el:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setValue({ ...value, [el.target.name]: el.target.value });
  };

  const toggleMember = (): void => {
    setValue({ ...value, isMember: !value.isMember });
  };

  const submitHandler = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      clearAlert();
      return;
    }
    const currentUser = {
      name,
      email,
      password,
    };
    if (isMember) {
      setUpUser({
        currentUser: currentUser,
        endPoint: "login",
        alertText: "User logging in. Redirecting...",
      });
    } else {
      setUpUser({
        currentUser: currentUser,
        endPoint: "register",
        alertText: "User created. Redirecting...",
      });
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page">
      <form onSubmit={submitHandler} className="form">
        <Logo />
        {value.isMember ? <h3>Login</h3> : <h3>Register</h3>}
        {showAlert && <Alert />}
        <div className="form-row">
          {!value.isMember && (
            <FormRow
              name="name"
              type="text"
              value={name}
              handleChange={handleChange}
              labelText="Name"
            />
          )}
          <FormRow
            name="email"
            type="email"
            value={email}
            handleChange={handleChange}
            labelText="E-mail"
          />
          <FormRow
            name="password"
            type="password"
            value={password}
            handleChange={handleChange}
            labelText="Password"
          />
        </div>

        <button type="submit" className="btn btn-block" disabled={isLoading}>
          Submit
        </button>
        <p>
          {value.isMember ? "Not a member yet? " : "Already a member?"}

          <button type="button" className="member-btn" onClick={toggleMember}>
            {value.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
