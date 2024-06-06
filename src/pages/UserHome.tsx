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
import { useRef, useState, useEffect } from "react";
import { BiUserCircle } from "react-icons/bi";
import { useAuth } from "../components/AuthContext";

interface User {
  userId: number;
  email: string;
  cpf: string;
  name: string;
  userAddress: Address[];
  billingAddress: Address;
  password: string;
}

interface Address {
  billingAdressId?: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export default function UserHome() {
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [openAdressModal, setOpenAdressModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    localidade: "",
    uf: "",
  });

  const { userEmail } = useAuth(); // Obtendo o e-mail do usuário autenticado

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/users/email/${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Erro ao buscar dados do usuário:", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, [userEmail]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [id]: value,
    }));
  };

  const handleAddAddress = async () => {
    console.log("handleAddAddress called");
    console.log("newAddress:", newAddress);

    if (user) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/users/${user.userId}/deliveryAddress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAddress),
        });

        if (response.ok) {
          console.log("Address added successfully");
          const updatedUser = await response.json(); // Assuming the response returns the updated user data
          setUser(updatedUser);
          setOpenAdressModal(false);
        } else {
          console.error("Erro ao adicionar endereço:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao adicionar endereço:", error);
      }
    } else {
      console.log("User is not defined");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="min-h-screen py-6 px-6 bg-[#111827]">
        <div className="overflow-x-auto">
          <Tabs
            className="py-6 px-2 rounded"
            aria-label="Full width tabs"
            style="fullWidth"
          >
            <Tabs.Item active title="Informações básicas" icon={BiUserCircle}>
              <List className="mb-4">
                <List.Item>Nome: {user?.name}</List.Item>
                <List.Item>Email: {user?.email}</List.Item>
                <List.Item>CPF: {user?.cpf}</List.Item>
              </List>
              <Button onClick={handleOpenModal} color="info">
                Alterar
              </Button>
            </Tabs.Item>
            <Tabs.Item title="Endereços" icon={BiUserCircle}>
              <List className="mb-4">
                <List.Item>CEP: {user?.billingAddress?.cep}</List.Item>
                <List.Item>Logradouro: {user?.billingAddress?.logradouro}</List.Item>
                <List.Item>Número: {user?.billingAddress?.numero}</List.Item>
                <List.Item>Complemento: {user?.billingAddress?.complemento}</List.Item>
                <List.Item>Bairro: {user?.billingAddress?.bairro}</List.Item>
                <List.Item>Localidade: {user?.billingAddress?.localidade}</List.Item>
                <List.Item>UF: {user?.billingAddress?.uf}</List.Item>
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
                <Label htmlFor="nome" value="Nome" />
              </div>
              <TextInput id="nome" defaultValue={user?.name} required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput id="email" defaultValue={user?.email} required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cpf" value="CPF" />
              </div>
              <TextInput id="cpf" defaultValue={user?.cpf} required />
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
                <Label htmlFor="cep" value="CEP" />
              </div>
              <TextInput
                className="w-44"
                id="cep"
                required
                onChange={handleInputChange}
                value={newAddress.cep}
              />
            </div>
            <div className="flex gap-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="logradouro" value="Logradouro" />
                </div>
                <TextInput
                  className="w-96"
                  id="logradouro"
                  type="string"
                  required
                  onChange={handleInputChange}
                  value={newAddress.logradouro}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="numero" value="Número" />
                </div>
                <TextInput
                  className="w-24"
                  id="numero"
                  required
                  onChange={handleInputChange}
                  value={newAddress.numero}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="complemento" value="Complemento" />
              </div>
              <TextInput
                className="w-96"
                id="complemento"
                type="string"
                required
                onChange={handleInputChange}
                value={newAddress.complemento}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="bairro" value="Bairro" />
              </div>
              <TextInput
                className="w-72"
                id="bairro"
                type="string"
                required
                onChange={handleInputChange}
                value={newAddress.bairro}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="localidade" value="Localidade" />
              </div>
              <TextInput
                className="w-72"
                id="localidade"
                type="string"
                required
                onChange={handleInputChange}
                value={newAddress.localidade}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="uf" value="UF" />
              </div>
              <Select id="uf" required onChange={handleInputChange} value={newAddress.uf}>
                <option value="">Selecione um estado</option>
                <option value="AC">AC</option>
                <option value="AL">AL</option>
                <option value="AP">AP</option>
                <option value="AM">AM</option>
                <option value="BA">BA</option>
                <option value="CE">CE</option>
                <option value="DF">DF</option>
                <option value="ES">ES</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="MG">MG</option>
                <option value="PA">PA</option>
                <option value="PB">PB</option>
                <option value="PR">PR</option>
                <option value="PE">PE</option>
                <option value="PI">PI</option>
                <option value="RJ">RJ</option>
                <option value="RN">RN</option>
                <option value="RS">RS</option>
                <option value="RO">RO</option>
                <option value="RR">RR</option>
                <option value="SC">SC</option>
                <option value="SP">SP</option>
                <option value="SE">SE</option>
                <option value="TO">TO</option>
              </Select>
            </div>
            <div className="w-full flex justify-between">
              <Button onClick={handleAddAddress} color="success">
                Adicionar
              </Button>
              <Button onClick={() => setOpenAdressModal(false)}>Cancelar</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
