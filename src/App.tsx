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

export default function App() {
  const redirectToListProducts = () => {
    console.log("Redirecionar para a lista de produtos");
  };

  const redirectToLogin = () => {
    console.log("Redirecionar para a lista de usuários");
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar />
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
          <Route path="/options" element={<Options />} />
          <Route
            path="/admin/signup"
            element={<SignUpForm redirectToLogin={redirectToLogin} />}
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
          <Route path="/description/:productId" element={<ProductDescription />} />
          <Route path="/user/home" element={<UserHome />} />
          <Route path="/options" element={<Options />} />
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