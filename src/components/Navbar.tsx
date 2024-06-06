import React, { useState, useEffect, ChangeEvent } from "react";
import { Button, Label, Navbar as Nav, Radio, Spinner, TextInput } from "flowbite-react";
import { BiCart, BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "./AuthContext";
import { logoutClient as logoutUserClient } from "./api";
import { addItemToCart, removeItemFromCart, getCartItems, increaseItemQuantity, decreaseItemQuantity, clearCart } from "./apiCart";
import { createOrder } from "./apiOrder"; // Importa a função para criar a ordem
import Login from "./Login";
import SignUp from "./SignUp";

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

interface NavbarProps {
  cartItems: CartItem[];
  updateCartItems: (items: CartItem[]) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartItems = [], updateCartItems }) => {
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [cep, setCep] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [showFreteOptions, setShowFreteOptions] = useState<boolean>(false);
  const [selectedFrete, setSelectedFrete] = useState<string>("padrao");
  const [freteValue, setFreteValue] = useState<number>(0);
  const [loadingFrete, setLoadingFrete] = useState<boolean>(false);
  const [isFreteSelected, setIsFreteSelected] = useState<boolean>(false);
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
  ) + freteValue;

  const handleIncreaseQuantity = async (productId: number) => {
    try {
      await increaseItemQuantity(1, productId); // Supondo que o ID do carrinho é 1, ajuste conforme necessário
      fetchCartItems();
    } catch (error) {
      console.error("Erro ao aumentar a quantidade do item no carrinho:", error);
    }
  };

  const handleDecreaseQuantity = async (productId: number) => {
    try {
      await decreaseItemQuantity(1, productId); // Supondo que o ID do carrinho é 1, ajuste conforme necessário
      fetchCartItems();
    } catch (error) {
      console.error("Erro ao diminuir a quantidade do item no carrinho:", error);
    }
  };

  const handleRemoveFromCart = async (productId: number, quantity: number) => {
    try {
      await removeItemFromCart(1, productId, quantity);
      const updatedCartItems = await getCartItems(1);
      updateCartItems(updatedCartItems);
      if (updatedCartItems.length === 0) {
        await clearCart(1);
        updateCartItems([]);
      }
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(1); // Supondo que o ID do carrinho é 1, ajuste conforme necessário
      updateCartItems([]);
    } catch (error) {
      console.error("Erro ao limpar o carrinho:", error);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setShowSignUpModal(true);
      return;
    }

    try {
      setLoading(true);
      localStorage.setItem('freightValue', freteValue.toString());
      console.log("frete passando do carrinho para orders" + localStorage.getItem("freightValue"))
      const response = await createOrder(1);
      if (response.ok) {
        await clearCart(1); // Limpa o carrinho após criar a ordem
        updateCartItems([]);
        setShowCartDrawer(false);
      } else {
        console.error("Erro ao criar a ordem:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao criar a ordem:", error);
    } finally {
      setLoading(false);
    }
  };

  const hideNavbarItems = location.pathname === "/admin/login";

  const handleCepChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCep(value);
    setIsButtonDisabled(value.trim() === ""); // Desabilita o botão se o campo estiver vazio
  };

  const handleCalcularFrete = () => {
    setLoadingFrete(true);
    setTimeout(() => {
      setLoadingFrete(false);
      setShowFreteOptions(true);
    }, 1000);
  };

  const handleFreteChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedFrete(value);
    setIsFreteSelected(true);

    switch(value) {
      case "padrao":
        setFreteValue(18.00);
        break;
      case "premium":
        setFreteValue(24.00);
        break;
      case "fast":
        setFreteValue(26.50);
        break;
      default:
        setFreteValue(0);
    }
  };  

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
        className={`fixed top-0 right-0 w-[600px] h-full bg-[#1F2937] shadow-lg transform overflow-y-auto ${
          showCartDrawer ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700 text-white">
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
              <div
                key={`${item.productId}-${Math.random()}`}
                className="flex mb-4"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-22 h-20 object-cover rounded mr-4"
                  />
                </div>
                <div className="flex-1 relative">
                  <h3 className="text-lg font-bold">{item.productName}</h3>
                  <div className="flex flex-row gap-2">
                    <p>Quantidade:</p>
                    <div className="flex flex-row items-center gap-4 ms-2 border border-gray-700 rounded p-[0.5]">
                      <BiMinus
                        cursor={"pointer"}
                        size={20}
                        onClick={() => handleDecreaseQuantity(item.productId)}
                      />
                      <span>{item.quantity}</span>
                      <BiPlus
                        cursor={"pointer"}
                        size={20}
                        onClick={() => handleIncreaseQuantity(item.productId)}
                      />
                    </div>
                  </div>
                  <p>Preço: R$ {(item.price * item.quantity).toFixed(2)}</p>
                  <span className="text-red-500 absolute top-0 right-0 cursor-pointer" onClick={handleClearCart} >Limpar Carrinho</span>
                  <BiTrash
                    cursor={"pointer"}
                    onClick={() => handleRemoveFromCart(item.productId, item.quantity)}
                    className="text-red-500 absolute bottom-0 right-0"
                  >
                    Remover
                  </BiTrash>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex-1 w-full">
          <div className="p-4 border-t border-gray-700 text-white">
            <div className="flex flex-row items-center gap-4 mb-4">
              <h3 className="font-bold text-lg">Calcular frete:</h3>
              <TextInput
                type="text"
                required
                sizing={"md"}
                placeholder="Informe seu CEP"
                value={cep}
                onChange={handleCepChange}
              />
              <Button onClick={handleCalcularFrete} disabled={isButtonDisabled || loadingFrete}>
                {loadingFrete ? <Spinner size="sm" light /> : "Calcular"}
              </Button>
            </div>
            {showFreteOptions && (
              <>
                <label className="gap-2 border border-gray-700 rounded w-full h-32 p-4 flex flex-col">
                  <div className="flex flex-row gap-2 items-center">
                    <Radio
                      id="frete-padrao"
                      name="frete"
                      value="padrao"
                      onChange={handleFreteChange}
                    />
                    <Label>Padrão</Label>
                  </div>
                  <p>Entrega padrão: Previsão de entrega 10 a 15 dias.</p>
                  <span>Valor do frete: <strong>R$ 18,00</strong></span>
                </label>
                <label className="mt-4 gap-2 border border-gray-700 rounded w-full h-32 p-4 flex flex-col">
                  <div className="flex flex-row gap-2 items-center">
                    <Radio
                      id="frete-premium"
                      name="frete"
                      value="premium"
                      onChange={handleFreteChange}
                    />
                    <Label>Premium</Label>
                  </div>
                  <p>Entrega <strong>SEDEX:</strong> Previsão de entrega 6 a 8 dias.</p>
                  <span>Valor do frete: <strong>R$ 24,00</strong></span>
                </label>
                <label className="mt-4 gap-2 border border-gray-700 rounded w-full h-32 p-4 flex flex-col">
                  <div className="flex flex-row gap-2 items-center">
                    <Radio
                      id="frete-fast"
                      name="frete"
                      value="fast"
                      onChange={handleFreteChange}
                    />
                    <Label>Fast Delivery</Label>
                  </div>
                  <p>Entrega <strong>CORREIOS:</strong> Previsão de entrega 2 a 4 dias.</p>
                  <span>Valor do frete: <strong>R$ 26,50</strong></span>
                </label>
              </>
            )}
          </div>
        </div>
        <div className="p-4 border-t border-gray-700 text-white">
          <h3 className="text-lg font-bold">
            Total: R$ {cartTotal.toFixed(2)}
          </h3>
          <Button color={"success"} className="mt-3" disabled={!isFreteSelected} onClick={handleCheckout} >Checkout</Button>
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
