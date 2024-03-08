import React from "react";
import { Navigate } from "react-router-dom";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";

const AuthPage: React.FC = () => {
  const history = Navigate();

  const redirectToLogin = () => {
    history.push("/login");
  };

  return (
    <div>
      <SignUpForm redirectToLogin={redirectToLogin} />
      <LoginForm />
    </div>
  );
};

export default AuthPage;
