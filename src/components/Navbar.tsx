import { useState, useEffect } from "react";
import { Button, Navbar as Nav, Spinner } from "flowbite-react";
import { BiCart } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import Login from "./Login";
import SignUp from "./SignUp";
import { useAuth } from "./AuthContext";
import { logoutClient } from "./api";
import { addItemToCart } from "../components/apiCart";
import { Link } from "react-router-dom";

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export default function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromLocalStorage());
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, userEmail, logout } = useAuth();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutClient();
      logout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/cart/viewCart/1'); // Ajuste o endpoint conforme necessário
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.items)) {
          const cartItems = data.items.map((item: any) => ({
            productId: item.product.productId,
            productName: item.product.productName,
            price: item.product.price,
            quantity: item.quantity,
          }));
          setCartItems(cartItems);
          saveCartToLocalStorage(cartItems);
        } else {
          console.error("A resposta do servidor não contém um array de itens:", data);
          setCartItems([]);
          saveCartToLocalStorage([]);
        }
      } else {
        console.error("Erro ao buscar itens do carrinho:", response.status);
        setCartItems([]);
        saveCartToLocalStorage([]);
      }
    } catch (error) {
      console.error("Erro ao buscar itens do carrinho:", error);
      setCartItems([]);
      saveCartToLocalStorage([]);
    }
  };

  const handleAddToCart = async (productId: number, productName: string, price: number) => {
    try {
      await addItemToCart(productId, 1);
      setCartItems((prevItems) => {
        const itemIndex = prevItems.findIndex((item) => item.productId === productId);
        const updatedItems = [...prevItems];
        if (itemIndex > -1) {
          updatedItems[itemIndex].quantity += 1;
        } else {
          updatedItems.push({ productId, productName, price, quantity: 1 });
        }
        saveCartToLocalStorage(updatedItems);
        return updatedItems;
      });
    } catch (error) {
      console.error("Erro ao adicionar item ao carrinho:", error);
    }
  };

  const removeItemFromCart = async (shoppingCartId: number, productId: number) => {
    try {
      await fetch(`http://localhost:8080/api/v1/cart/removeItem/${shoppingCartId}/${productId}`, {
        method: "DELETE",
      });
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.productId !== productId);
        saveCartToLocalStorage(updatedItems);
        return updatedItems;
      });
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
    }
  };

  useEffect(() => {
    if (showCartDrawer) {
      fetchCartItems(); // Carrega os itens do carrinho quando o drawer é aberto
    }
  }, [showCartDrawer]);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      <Nav fluid>
        <Nav.Brand href="/home">
          <img
            src="https://imgur.com/m1xs6LH.png"
            className="mr-3 h-6 sm:h-9"
            alt="4bits Logo"
          />
        </Nav.Brand>
        <div className="flex md:order-2">
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
                <Link to="/user/home">
                  <span className="text-white">Bem vindo(a), {userEmail}</span>
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
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Nav>
      {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
      {showSignUpModal && <SignUp onClose={() => setShowSignUpModal(false)} />}

      <div
        className={`fixed top-0 right-0 w-64 h-full bg-[#1F2937] shadow-lg transform ${
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
              <div key={item.productId} className="flex justify-between mb-4">
                <div>
                  <h3 className="font-bold">{item.productName}</h3>
                  <p>Quantidade: {item.quantity}</p>
                  <p>Preço: R$ {item.price.toFixed(2)}</p>
                  <button
                    onClick={() => removeItemFromCart(1, item.productId)} // Passar o ID correto do carrinho
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
          <h3 className="text-lg font-bold">Total: R$ {cartTotal.toFixed(2)}</h3>
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
}

const saveCartToLocalStorage = (cartItems: CartItem[]) => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

const loadCartFromLocalStorage = (): CartItem[] => {
  const savedCart = localStorage.getItem('cartItems');
  return savedCart ? JSON.parse(savedCart) : [];
};
