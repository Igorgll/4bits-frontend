import { Button, Navbar as Nav } from "flowbite-react";
import { BiCart } from "react-icons/bi";

export default function Navbar() {
  return (
    <Nav fluid rounded>
      <Nav.Brand>
        {/* <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" /> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">4bits LOGO</span>
      </Nav.Brand>
      <div className="flex md:order-2">
        <div className="flex items-center gap-4">
          <Button>Cadastre-se</Button>
          <Button>Login</Button>
          <BiCart color={"white"} size={24} cursor={"pointer"} />
        </div>
        <Nav.Toggle />
      </div>
      <Nav.Collapse>
        <Nav.Link href="#" active>
          Home
        </Nav.Link>
        <Nav.Link href="#">Sobre</Nav.Link>
        <Nav.Link href="#">Serviços</Nav.Link>
        <Nav.Link href="#">Contato</Nav.Link>
      </Nav.Collapse>
    </Nav>
  );
}