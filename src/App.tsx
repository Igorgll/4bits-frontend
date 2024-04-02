import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import ListUsers from "./components/ListUsers";
import Options from "./components/Options";
import SignUpForm from "./components/SignUpForm";
import UpdateUserForm from "./components/UpdateUser";
<<<<<<< HEAD
import CreateProduct from "./components/CreateProduct"; // Importe o componente da página de criar produto
import "./index.css";
=======
import ListProducts from "./components/ListProducts";
import Home from "./pages/Home";
import ProductDescription from "./pages/ProductDescription";
>>>>>>> 6df0b25057c9647ccfd5a4104203835443d4db33

export default function App() {
  const redirectToListUsers = () => {

    console.log("Redirecionar para a list de users");
  };

  const redirectToLogin = () => {
    console.log("Redirecionar para a list de users");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm redirectToListUsers={redirectToListUsers}/>} />
        <Route path="/login" element={<LoginForm redirectToListUsers={redirectToListUsers} />} />
        <Route path="/listUsers" element={<ListUsers />}  />
        <Route path="/options" element={<Options />}  />
        <Route path="/createUser" element={<SignUpForm redirectToLogin={redirectToLogin}/>}  />
        <Route path="/updateUser" element={<UpdateUserForm redirectToLogin={redirectToLogin} />}  />
<<<<<<< HEAD
        {/* Adicione a rota para a página de criar produto */}
        <Route path="/createProduct" element={<CreateProduct />} />

=======
        <Route path="/listProducts" element={<ListProducts />}  />
        <Route path="/home" element={<Home />} />
        <Route path="/description" element={<ProductDescription />} />
>>>>>>> 6df0b25057c9647ccfd5a4104203835443d4db33
      </Routes>
    </Router>
  );
}