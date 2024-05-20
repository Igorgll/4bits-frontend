import { useState } from "react";
import { Button, Navbar as Nav } from "flowbite-react";
import { BiCart } from "react-icons/bi";
import Login from "./Login";
import SignUp from "./SignUp";
import { IoMdClose } from "react-icons/io";

export default function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

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
            <Button onClick={() => setShowSignUpModal(true)}>Cadastre-se</Button>
            <Button onClick={() => setShowLoginModal(true)}>Login</Button>
            <BiCart
              color={"white"}
              size={24}
              cursor={"pointer"}
              onClick={() => setShowCartDrawer(true)}
            />
          </div>
          <Nav.Toggle />
        </div>
      </Nav>
      {/* render login modal */}
      {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}

      {/* render SignUp modal */}
      {showSignUpModal && <SignUp onClose={() => setShowSignUpModal(false)} />}

      {/* render Cart Drawer */}
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
          <p>Seu carrinho está vazio.</p>
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