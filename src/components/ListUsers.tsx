import { useState, useEffect } from "react";
import Wrapper from "./Wrapper";
import { Label, Select, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput } from 'flowbite-react';
import { Button, Modal } from "flowbite-react";
import SearchBar from "./SearchBar";
import ConfirmUpdateUserDialog from "./ConfirmUpdateUserDialog";

interface UserDTO {
  userId: number;
  name: string;
  email: string;
  cpf: string;
  group: string;
  password: string;
  isActive: boolean;
}

const ListUsers = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null); // Estado para armazenar o usuário selecionado para edição
  const [users, setUsers] = useState<UserDTO[]>([]); // Estado para armazenar os dados dos usuários
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/listUsersBasicInfo"
      );
      if (response.ok) {
        const data: UserDTO[] = await response.json();
        setUsers(data); // Atualiza o estado com os dados dos usuários
        setConfirmDialogOpen(false);
      } else {
        console.error("Falha ao carregar os dados dos usuários");
      }
    } catch (error) {
      console.error("Erro ao carregar os dados dos usuários:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user: UserDTO) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    fetchUsers();
  };

  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      if (!selectedUser) return;
  
      const updatedUser = { ...selectedUser };
  
      // Atualizar os dados do usuário com os valores dos campos de entrada
      const nameInput = document.getElementById("name") as HTMLInputElement | null;
      const emailInput = document.getElementById("email") as HTMLInputElement | null;
      const cpfInput = document.getElementById("cpf") as HTMLInputElement | null;
      const groupSelect = document.getElementById("group") as HTMLSelectElement | null;
      const passwordInput = document.getElementById("password") as HTMLInputElement | null;
      const confirmPasswordInput = document.getElementById("confirmPassword") as HTMLInputElement | null;
  
      if (!nameInput || !emailInput || !cpfInput || !groupSelect || !passwordInput || !confirmPasswordInput) {
        console.error("Não foi possível encontrar todos os elementos necessários.");
        return;
      }
  
      updatedUser.name = nameInput.value;
      updatedUser.email = emailInput.value;
      updatedUser.cpf = cpfInput.value;
      updatedUser.group = groupSelect.value;
      updatedUser.password = passwordInput.value;
  
      if (passwordInput.value !== confirmPasswordInput.value) {
        console.error("Os campos de senha não correspondem.");
        return;
      }
  
      // Atualize o estado selectedUser diretamente com o objeto atualizado
      setSelectedUser(updatedUser);

      const response = await fetch(
        `http://localhost:8080/api/v1/users/updateUser/${selectedUser.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (response.ok) {
        console.log("Usuário atualizado com sucesso");
        handleCloseModal();
      } else {
        console.error("Falha ao atualizar o usuário");
      }
      
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
    }
  };

  return (
    <Wrapper className="bg-[#111827]">
      <SearchBar />
      <Table striped>
        <TableHead>
          <TableHeadCell>Nome</TableHeadCell>
          <TableHeadCell>Email</TableHeadCell>
          <TableHeadCell>CPF</TableHeadCell>
          <TableHeadCell>Grupo</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Alterar</span>
          </TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {users.map((user, index) => (
          <TableRow key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {user.name}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.cpf}</TableCell>
            <TableCell>{user.group}</TableCell>
            <TableCell>{user.isActive ? "Inativo" : "Ativo"}</TableCell>
            <TableCell>
              <a
                href="#"
                className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                onClick={() => handleOpenModal(user)} // Abrir o modal ao clicar no link "Alterar"
              >
                Alterar
              </a>
            </TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedUser && ( // Renderizar o modal apenas se houver um usuário selecionado
        <Modal show={openModal} onClose={handleCloseModal}>
          <Modal.Header />
          <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Alterar Usuário</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                value={selectedUser.email}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Nome" />
              </div>
              <TextInput
                id="name"
                placeholder={selectedUser.name}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cpf" value="CPF" />
              </div>
              <TextInput
                id="cpf"
                value={selectedUser.cpf}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    cpf: e.target.value
                  });
                }}
                required
              />
            </div>
            <div className="max-w-full">
            <div className="mb-2 block">
              <Label htmlFor="group" value="Selecione o grupo" />
            </div>
            <Select id="group" required defaultValue={selectedUser.group}>
              <option>Admin</option>
              <option>Estoquista</option>
            </Select>
          </div>
          <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Senha" />
              </div>
              <TextInput
                id="password"
                value={selectedUser.password}
                required
                type="password"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="confirmPassword" value="Confirmar Senha" />
              </div>
              <TextInput
                id="confirmPassword"
                value={selectedUser.password}
                required
                type="password"
              />
            </div>
            <div className="w-full flex justify-between">
              <Button color="success" onClick={handleOpenConfirmDialog}>Alterar</Button>
              <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
            </div>
          </div>
          </Modal.Body>
        </Modal>
      )}
      {selectedUser && confirmDialogOpen && (
        <ConfirmUpdateUserDialog 
        user={selectedUser} 
        onClose={() => setConfirmDialogOpen(false)} 
        onUpdateUser={handleUpdateUser}
        />
      )}
    </Wrapper>
  );
};

export default ListUsers;
