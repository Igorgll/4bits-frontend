import { Button, Navbar as Nav } from "flowbite-react";
import { useState } from "react";
import { BiCart } from "react-icons/bi";
import Login from "./Login";
import SignUp from "./SignUp";
import CartSlideOver from "./ShoppingCart";
export default function Navbar({ toggleCart }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  return (
    <>
      <Nav fluid>
        <Nav.Brand href="/home">
          <img src="https://imgur.com/m1xs6LH.png" className="mr-3 h-6 sm:h-9" alt="4bits Logo" />
        </Nav.Brand>
        <div className="flex md:order-2">
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowSignUpModal(true)}>Cadastre-se</Button>
            <Button onClick={() => setShowLoginModal(true)}>Login</Button>
            <Button onClick={toggleCart}>
              <BiCart color={"white"} size={24} cursor={"pointer"} />
            </Button>
          </div>
        </div>
      </Nav>
      {/* render login modal */}
      {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}

      {/* render SignUp modal */}
      {showSignUpModal && <SignUp onClose={() => setShowSignUpModal(false)} />}
    </>
  );
}