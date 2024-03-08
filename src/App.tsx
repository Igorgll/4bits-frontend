import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import "./index.css";
import ListUsers from "./components/ListUsers";
import Home from "./components/Home";

export default function App() {
  const redirectToLogin = () => {
    console.log("Redirecionar para a página de login");
  };

  const redirectToListUsers = () => {
    console.log("Redirecionar para a list de users");
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpForm redirectToLogin={redirectToLogin} />} />
        <Route path="/login" element={<LoginForm redirectToListUsers={redirectToListUsers} />} />
        <Route path="/listUsers" element={<ListUsers />}  />
        <Route path="/home" element={<Home />}  />
      </Routes>
    </Router>
  );
}
