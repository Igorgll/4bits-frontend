import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import "./index.css";
import ListUsers from "./components/ListUsers";
import Home from "./components/Home";

export default function App() {
  const redirectToListUsers = () => {
    console.log("Redirecionar para a list de users");
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm redirectToListUsers={redirectToListUsers}/>} />
        <Route path="/login" element={<LoginForm redirectToListUsers={redirectToListUsers} />} />
        <Route path="/listUsers" element={<ListUsers />}  />
        <Route path="/home" element={<Home />}  />
      </Routes>
    </Router>
  );
}
