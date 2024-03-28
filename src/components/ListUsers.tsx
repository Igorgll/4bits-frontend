import { useState, useEffect } from "react";
import Wrapper from "./Wrapper";
import {
  Label,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
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
  active: boolean;
}

const ListUsers = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null); // Estado para armazenar o usuário selecionado para edição
  const [users, setUsers] = useState<UserDTO[]>([]); // Estado para armazenar os dados dos usuários
  const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>([]); // Estado para armazenar os usuários filtrados
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userId, setUserId] = useState<number | undefined>(/* valor inicial */);
  const [newStatus, setNewStatus] = useState<boolean | undefined>(/* valor inicial */);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/listUsersBasicInfo"
      );
      if (response.ok) {
        const data: any[] = await response.json();
        const convertedData: UserDTO[] = data.map((user) => ({
          userId: user.userId,
          name: user.name,
          email: user.email,
          cpf: user.cpf,
          group: user.group,
          password: user.password,
          active: user.active
        }));
        setUsers(convertedData);
      } else {
        console.error("Falha ao carregar os dados dos usuários");
      }
    } catch (error) {
      console.error("Erro ao carregar os dados dos usuários:", error);
    }
  };

  const handleChangeUserStatus = async (userId: number, active: boolean) => {
    try {
      if (typeof active !== 'boolean') {
        console.error('O valor de active não é um booleano');
        return;
      }
  
      const response = await fetch(
        `http://localhost:8080/api/v1/users/isUserActive/${userId}/${!!active}`,
        {
          method: "PATCH",
        }
      );
        
      if (response.ok) {
        const updatedUsers = users.map((user) => {
          if (user.userId === userId) {
            return {
              ...user,
              active: active,
            };
          }
          return user;
        });
        setUsers(updatedUsers); // Atualize o estado localmente
        console.log("User status alterado com sucesso");
      } else {
        console.error("Falha ao mudar o status do usuário:", response.statusText);
      }
    } catch (error) {
      console.error("Falha ao mudar o status do usuário:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (userId !== undefined && newStatus !== undefined) {
      handleChangeUserStatus(userId, newStatus);
    }
  }, [userId, newStatus]);

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
  
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };
  
  const handleConfirmUpdateUser = async () => {
    handleCloseConfirmDialog(); // Fecha o diálogo de confirmação
    await handleUpdateUser(); // Realiza a atualização do usuário
  };

  const handleUpdateUser = async () => {
    try {
      if (!selectedUser) return;

      const updatedUser = { ...selectedUser };

      // Atualizar os dados do usuário com os valores dos campos de entrada
      const nameInput = document.getElementById(
        "name"
      ) as HTMLInputElement | null;
      const emailInput = document.getElementById(
        "email"
      ) as HTMLInputElement | null;
      const cpfInput = document.getElementById(
        "cpf"
      ) as HTMLInputElement | null;
      const groupSelect = document.getElementById(
        "group"
      ) as HTMLSelectElement | null;
      const passwordInput = document.getElementById(
        "password"
      ) as HTMLInputElement | null;
      const confirmPasswordInput = document.getElementById(
        "confirmPassword"
      ) as HTMLInputElement | null;

      if (
        !nameInput ||
        !emailInput ||
        !cpfInput ||
        !groupSelect ||
        !passwordInput ||
        !confirmPasswordInput
      ) {
        console.error(
          "Não foi possível encontrar todos os elementos necessários."
        );
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

  const handleSearch = (searchTerm: string) => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };  

  return (
    <Wrapper className="bg-[#111827]">
      <SearchBar onSearch={handleSearch} />
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
          {filteredUsers.length === 0 ? (
            // Se não houver resultado de pesquisa, renderize todos os usuários
            users.map((user, index) => (
              <TableRow
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.cpf}</TableCell>
                <TableCell>{user.group}</TableCell>
                <TableCell>
                <a
                  href="#"
                  className={`font-medium ${
                    user.active ? 'text-green-600' : 'text-red-600'
                  } hover:underline`}
                  onClick={(e) => {
                    e.preventDefault();
                    const newStatus = !user.active;
                    handleChangeUserStatus(user.userId, newStatus);
                  }}
                >
                  {user.active ? "Ativo" : "Inativo"}
                </a>
                </TableCell>
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
            ))
          ) : (
            // Se houver resultados de pesquisa, renderize apenas os usuários filtrados
            filteredUsers.map((user, index) => (
              <TableRow
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.cpf}</TableCell>
                <TableCell>{user.group}</TableCell>
                <TableCell>
                  <a
                    href="#"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    onClick={(e) => {
                      e.preventDefault();
                      const newStatus = !user.active;
                      handleChangeUserStatus(user.userId, newStatus);
                    }}
                  >
                    {user.active ? "Inativo" : "Ativo"}
                  </a>
                </TableCell>
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
            ))
          )}
        </TableBody>
      </Table>
      {selectedUser && ( // Renderizar o modal apenas se houver um usuário selecionado
        <Modal show={openModal} onClose={handleCloseModal}>
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Alterar Usuário
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Email" />
                </div>
                <TextInput id="email" value={selectedUser.email} required />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Nome" />
                </div>
                <TextInput id="name" placeholder={selectedUser.name} required />
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
                      cpf: e.target.value,
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
                <Button color="success" onClick={handleOpenConfirmDialog}>
                  Alterar
                </Button>
                <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
      {selectedUser && confirmDialogOpen && (
        <ConfirmUpdateUserDialog
          user={selectedUser}
          onClose={handleCloseConfirmDialog}
          onUpdateUser={handleConfirmUpdateUser}
        />
      )}
    </Wrapper>
  );
};

export default ListUsers;
