import React, { useState, useEffect } from "react";
import { Button, Navbar as Nav, Spinner } from "flowbite-react";
import { BiCart } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { logoutClient as logoutUserClient } from "./api";
import { addItemToCart, removeItemFromCart, getCartItems } from "./apiCart";
import Login from "./Login";
import SignUp from "./SignUp";

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image: string; // Adicione esta linha para incluir a imagem
}

interface NavbarProps {
  cartItems: CartItem[];
  updateCartItems: (items: CartItem[]) => void; // Adicione esta linha
}

const Navbar: React.FC<NavbarProps> = ({ cartItems = [], updateCartItems }) => { // Adicione `updateCartItems` aqui
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    isAuthenticated,
    userEmail,
    userRole,
    userName,
    logout,
    logoutAdmin,
    login,
  } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole") as UserRole | null;
    const name = localStorage.getItem("userName");
    if (token && email && role && name) {
      login(email, token, role, name); // Revalida a sessão se necessário
    }
  }, [login]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems(); // Fetch cart items when user is authenticated
    }
  }, [isAuthenticated]);

  const fetchCartItems = async () => {
    try {
      const items = await getCartItems(1); // Supondo que o ID do carrinho é 1, ajuste conforme necessário
      updateCartItems(items); // Use `updateCartItems` para atualizar o estado do carrinho
    } catch (error) {
      console.error("Erro ao buscar itens do carrinho:", error);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (userRole === "ROLE_ADMIN") {
        await logoutAdmin();
      } else {
        await logoutUserClient();
      }
      logout();
      localStorage.removeItem("userName");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = (cartItems || []).reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemoveFromCart = async (productId: number) => {
    try {
      await removeItemFromCart(1, productId); // Supondo que o ID do carrinho é 1, ajuste conforme necessário
      fetchCartItems(); // Recarrega os itens do carrinho
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
    }
  };

  const hideNavbarItems = location.pathname === "/admin/login";

  return (
    <>
      <Nav fluid>
        <Nav.Brand href="/">
          <img
            src="https://imgur.com/m1xs6LH.png"
            className="mr-3 h-6 sm:h-9"
            alt="4bits Logo"
          />
        </Nav.Brand>
        <div className="flex md:order-2">
          {!hideNavbarItems && (
            <div className="flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Button onClick={() => setShowSignUpModal(true)}>
                    Cadastre-se
                  </Button>
                  <Button onClick={() => setShowLoginModal(true)}>Login</Button>
                </>
              ) : (
                <>
                  <Link
                    to={
                      userRole === "ROLE_ADMIN" ? "/admin/home" : "/user/home"
                    }
                  >
                    <span className="text-white">Bem vindo(a), {userName}</span>
                  </Link>
                  <Button onClick={handleLogout} disabled={loading}>
                    {loading ? <Spinner size="sm" light /> : "Sair"}
                  </Button>
                </>
              )}
              <div className="relative">
                <BiCart
                  color={"white"}
                  size={24}
                  cursor={"pointer"}
                  onClick={() => setShowCartDrawer(true)}
                />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-[6px] font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Nav>
      {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
      {showSignUpModal && <SignUp onClose={() => setShowSignUpModal(false)} />}

      <div
        className={`fixed top-0 right-0 w-[600px] h-full bg-[#1F2937] shadow-lg transform ${
          showCartDrawer ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 flex justify-between items-center border-b text-white">
          <h2 className="text-lg font-bold">Carrinho</h2>
          <button onClick={() => setShowCartDrawer(false)}>
            <IoMdClose />
          </button>
        </div>
        <div className="p-4 text-white">
          {cartItems.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.productId} className="flex mb-4">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 object-cover mr-4"
                />
                <div className="flex flex-col">
                  <h3>{item.productName}</h3>
                  <p>Quantidade: {item.quantity}</p>
                  <p>Preço: R$ {item.price.toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveFromCart(item.productId)}
                    className="text-red-500"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-gray-700 text-white">
          <h3 className="text-lg font-bold">
            Total: R$ {cartTotal.toFixed(2)}
          </h3>
        </div>
      </div>

      {showCartDrawer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowCartDrawer(false)}
        ></div>
      )}
    </>
  );
};

const saveCartToLocalStorage = (cartItems: CartItem[]) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

const loadCartFromLocalStorage = (): CartItem[] => {
  const savedCart = localStorage.getItem("cartItems");
  return savedCart ? JSON.parse(savedCart) : [];
};

const logoutClient = async (): Promise<void> => {
  const token = localStorage.getItem("sessionToken");
  const response = await fetch(
    "http://localhost:8080/api/v1/users/clientLogout",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": token ? token : "",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  localStorage.removeItem("sessionToken");
};

export { logoutClient as logoutUserClient };
export default Navbar;
