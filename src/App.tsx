import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListUsers from "./components/ListUsers";
import Options from "./components/Options";
import SignUpForm from "./components/SignUpForm";
import UpdateUserForm from "./components/UpdateUser";
import ListProducts from "./components/ListProducts";
import Home from "./pages/Home";
import ProductDescription from "./pages/ProductDescription";
import UserHome from "./pages/UserHome";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./components/AuthContext";
import AdminEstoquistaLogin from "./components/AdminEstoquistaLogin";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import ListOrders from "./components/ListOrders";
import { useEffect, useState } from "react";
import { getCartItems } from "./components/apiCart";

export default function App() {
  const redirectToListProducts = () => {
    console.log("Redirecionar para a lista de produtos");
  };

  const redirectToLogin = () => {
    console.log("Redirecionar para a lista de usuários");
  };

  const [cartItems, setCartItems] = useState([]);

  const updateCartItems = async () => {
    try {
      const items = await getCartItems(1);
      setCartItems(items);
    } catch (error) {
      console.error("Erro ao buscar itens do carrinho:", error);
    }
  };

  useEffect(() => {
    updateCartItems();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar cartItems={cartItems} updateCartItems={updateCartItems} />
        <Routes>
          <Route
            path="/admin/login"
            element={<AdminEstoquistaLogin redirectToListProducts={redirectToListProducts} />}
          />
          <Route
            path="/listUsers" 
            element={
              <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_ESTOQUISTA']}>
                <ListUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/signup"
            element={
              <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                <SignUpForm redirectToLogin={redirectToLogin} />
              </PrivateRoute>
            }
          />
          <Route
            path="/updateUser"
            element={<UpdateUserForm redirectToLogin={redirectToLogin} />}
          />
          <Route
            path="/listProducts"
            element={
              <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_ESTOQUISTA']}>
                <ListProducts />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/description/:productId" element={<ProductDescription updateCartItems={updateCartItems} />} />
          <Route path="/user/home" element={<UserHome />} />
          <Route path="/options" 
            element={
              <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_ESTOQUISTA"]}>
                <Options />
              </PrivateRoute>
            } />
          <Route
            path="/list/orders"
            element={
              <PrivateRoute allowedRoles={['ROLE_ESTOQUISTA']}>
                <ListOrders />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}