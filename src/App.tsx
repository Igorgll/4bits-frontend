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
import AdminLogin from "./components/AdminLogin";
import Footer from "./components/Footer";

export default function App() {
  const redirectToListProducts = () => {
    console.log("Redirecionar para a list de products");
  };

  const redirectToLogin = () => {
    console.log("Redirecionar para a list de users");
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/admin/login"
            element={<AdminLogin redirectToListProducts={redirectToListProducts} />}
          />
          <Route
            path="/listUsers" 
            element={<ListUsers />}
          />
          <Route path="/options" element={<Options />} />
          <Route
            path="/createUser"
            element={<SignUpForm redirectToLogin={redirectToLogin} />}
          />
          <Route
            path="/updateUser"
            element={<UpdateUserForm redirectToLogin={redirectToLogin} />}
          />
          <Route path="/listProducts" element={<ListProducts />} />
          <Route path="/home" element={<Home />} />
          <Route path="/description/:productId" element={<ProductDescription />} />
          <Route path="/user/home" element={<UserHome />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
