import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import "./index.css";
import ListUsers from "./components/ListUsers";
import Home from "./components/Home";
import SignUpForm from "./components/SignUpForm";
import UpdateUserForm from "./components/UpdateUser";
import ListProducts from "./components/ListProducts";

export default function App() {
  const redirectToListUsers = () => {console.log("Redirecionar para a list de users");}
  const redirectToLogin = () => {console.log("Redirecionar para a list de users");}

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm redirectToListUsers={redirectToListUsers}/>} />
        <Route path="/login" element={<LoginForm redirectToListUsers={redirectToListUsers} />} />
        <Route path="/listUsers" element={<ListUsers />}  />
        <Route path="/home" element={<Home />}  />
        <Route path="/createUser" element={<SignUpForm redirectToLogin={redirectToLogin}/>}  />
        <Route path="/updateUser" element={<UpdateUserForm redirectToLogin={redirectToLogin} />}  />
        <Route path="/listProducts" element={<ListProducts />}  />
      </Routes>
    </Router>
  );
}
