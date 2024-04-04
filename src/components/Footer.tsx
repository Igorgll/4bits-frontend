import { FooterBrand, Footer as FooterFlowbite } from "flowbite-react";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

export default function Footer() {
  return (
    <FooterFlowbite bgDark>
      <div className="w-full">
        <div className="grid w-full grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
          <div>
            <FooterBrand src="https://imgur.com/m1xs6LH.png" className="mr-3 mb-4 h-6 sm:h-9" alt="4bits Logo" />
            <FooterFlowbite.LinkGroup col>
              <FooterFlowbite.Link href="#">Sobre</FooterFlowbite.Link>
              <FooterFlowbite.Link href="#">Blog</FooterFlowbite.Link>
            </FooterFlowbite.LinkGroup>
          </div>
          <div>
            <FooterFlowbite.Title title="Centro de ajuda" />
            <FooterFlowbite.LinkGroup col>
              <FooterFlowbite.Link href="#">Discord Server</FooterFlowbite.Link>
              <FooterFlowbite.Link href="#">Twitter</FooterFlowbite.Link>
              <FooterFlowbite.Link href="#">Facebook</FooterFlowbite.Link>
              <FooterFlowbite.Link href="#">Contato</FooterFlowbite.Link>
            </FooterFlowbite.LinkGroup>
          </div>
          <div>
            <FooterFlowbite.Title title="legal" />
            <FooterFlowbite.LinkGroup col>
              <FooterFlowbite.Link href="#">Política de Privacidade</FooterFlowbite.Link>
              <FooterFlowbite.Link href="#">Licença</FooterFlowbite.Link>
              <FooterFlowbite.Link href="#">Termos &amp; Condições</FooterFlowbite.Link>
            </FooterFlowbite.LinkGroup>
          </div>
          <div>
            <FooterFlowbite.Title title="download" />
            <FooterFlowbite.LinkGroup col>
              <FooterFlowbite.Link href="#">iOS</FooterFlowbite.Link>
              <FooterFlowbite.Link href="#">Android</FooterFlowbite.Link>
              <FooterFlowbite.Link href="#">Windows</FooterFlowbite.Link>
              <FooterFlowbite.Link href="#">MacOS</FooterFlowbite.Link>
            </FooterFlowbite.LinkGroup>
          </div>
        </div>
        <div className="w-full bg-gray-700 px-4 py-6 sm:flex sm:items-center sm:justify-between">
          <FooterFlowbite.Copyright href="#" by="4bits™" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <FooterFlowbite.Icon href="#" icon={BsFacebook} />
            <FooterFlowbite.Icon href="#" icon={BsInstagram} />
            <FooterFlowbite.Icon href="#" icon={BsTwitter} />
            <FooterFlowbite.Icon href="#" icon={BsGithub} />
            <FooterFlowbite.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </FooterFlowbite>
  );
}
