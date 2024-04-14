import { Button, Navbar as Nav } from "flowbite-react";
import { BiCart } from "react-icons/bi";

export default function Navbar() {
  return (
    <Nav fluid>
      <Nav.Brand href="/home">
        <img src="https://imgur.com/m1xs6LH.png" className="mr-3 h-6 sm:h-9" alt="4bits Logo" />
      </Nav.Brand>
      <div className="flex md:order-2">
        <div className="flex items-center gap-4">
          <Button>Cadastre-se</Button>
          <Button>Login</Button>
          <BiCart color={"white"} size={24} cursor={"pointer"} />
        </div>
        <Nav.Toggle />
      </div>
    </Nav>
  );
}