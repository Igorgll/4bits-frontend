import {
  Button,
  Label,
  List,
  Modal,
  Select,
  Tabs,
  TabsRef,
  TextInput,
} from "flowbite-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useRef, useState } from "react";
import { BiUserCircle } from "react-icons/bi";

export default function UserHome() {
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [openAdressModal, setOpenAdressModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAdressOpenModal = () => {
    setOpenAdressModal(true);
  };

  const handleCloseAdressModal = () => {
    setOpenAdressModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="min-h-screen py-6 px-6 bg-[#111827]">
        <div className="overflow-x-auto">
          <Tabs
            className="py-6 px-2 rounded"
            aria-label="Full width tabs"
            style="fullWidth"
          >
            <Tabs.Item active title="Informações básicas" icon={BiUserCircle}>
              <List className="mb-4">
                <List.Item>Nome:</List.Item>
                <List.Item>Data de Nascimento:</List.Item>
                <List.Item>Genêro:</List.Item>
              </List>
              <Button onClick={handleOpenModal} color="info">
                Alterar
              </Button>
            </Tabs.Item>
            <Tabs.Item title="Endereços" icon={BiUserCircle}>
              <List className="mb-4">
                <List.Item>CEP:</List.Item>
                <List.Item>Logradouro:</List.Item>
                <List.Item>Número:</List.Item>
                <List.Item>UF:</List.Item>
              </List>
              <Button onClick={handleAdressOpenModal} color="success">
                Adicionar novo endereço
              </Button>
            </Tabs.Item>
          </Tabs>
        </div>
      </div>
      <Footer />

      {/* MODAL DE ALTERAR USUÁRIO */}
      <Modal show={openModal} onClose={handleCloseModal}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Alterar Usuário
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Nome" />
              </div>
              <TextInput id="name" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="birthDate" value="Data de Nascimento (dd/mm/aaaa)" />
              </div>
              <TextInput id="birthDate" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="gender" value="Genero" />
              </div>
              <TextInput id="gender" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Senha" />
              </div>
              <TextInput id="password" required type="password" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="confirmPassword" value="Confirmar Senha" />
              </div>
              <TextInput id="confirmPassword" required type="password" />
            </div>
            <div className="w-full flex justify-between">
              <Button onClick={() => setOpenModal(false)} color="success">
                Alterar
              </Button>
              <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* MODAL DE ADICIONAR ENDEREÇO */}
      <Modal show={openAdressModal} onClose={handleCloseAdressModal} size={"4xl"}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Endereço
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="CEP" value="CEP" />
              </div>
              <TextInput className="w-44" id="cep" required />
            </div>
            <div className="flex gap-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="Street Name" value="Logradouro" />
                </div>
                <TextInput
                  className="w-96"
                  id="street"
                  type="string"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="House number" value="Número" />
                </div>
                <TextInput id="street" type="string" required />
              </div>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="Complemento" value="Complemento" />
                </div>
                <TextInput
                  className="w-96"
                  id="complemento"
                  type="string"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="Bairro" value="Bairro" />
                </div>
                <TextInput
                  className="w-96"
                  id="bairro"
                  type="string"
                  required
                />
              </div>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="Cidade" value="Cidade" />
                </div>
                <TextInput
                  className="w-96"
                  id="cidade"
                  type="string"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="UF" value="UF" />
                </div>
                <Select className="w-40" id="cidades" required>
                  <option value="">Selecione uma UF</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </Select>
              </div>
            </div>
            <div className="w-full flex justify-between">
              <Button onClick={() => setOpenModal(false)} color="success">
                Adicionar
              </Button>
              <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
