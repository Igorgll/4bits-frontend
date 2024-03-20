import { useState, useEffect } from "react";
import Wrapper from "./Wrapper";
import { Button, Modal } from 'flowbite-react';

interface UserDTO {
  name: string;
  email: string;
  password: string;
  group: string;
  isActive: boolean;
}

const ListUsers = () => {
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState<UserDTO[]>([]); // Estado para armazenar os dados dos usuários

  useEffect(() => {
    // Função para fazer a requisição GET ao endpoint
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/users/listUsersBasicInfo"
        );
        if (response.ok) {
          const data: UserDTO[] = await response.json();
          setUsers(data); // Atualiza o estado com os dados dos usuários
        } else {
          console.error("Falha ao carregar os dados dos usuários");
        }
      } catch (error) {
        console.error("Erro ao carregar os dados dos usuários:", error);
      }
    };

    // Chama a função para fazer a requisição GET ao endpoint
    fetchUsers();
  }, []);

  return (
    <Wrapper className="bg-[#111827] absolute">
      <div className="mt-4">
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-white">Nome</th>
              <th className="px-4 py-2 text-white">Email</th>
              <th className="px-4 py-2 text-white">Grupo</th>
              <th className="px-4 py-2 text-white">Ativo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="border px-4 py-2 text-white">{user.name}</td>
                <td className="border px-4 py-2 text-white">{user.email}</td>
                <td className="border px-4 py-2 text-white">
                  {user.group}
                </td>
                <td className="border px-4 py-2 flex items-center justify-center text-white">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </td>
                <td className="border px-4 py-2 text-white">
                  <Button onClick={() => setOpenModal(true)}>Alterar</Button>
                </td>
              </tr>
            ))}
          </tbody>
          <div>
            <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
              <Modal.Header>Terms of Service</Modal.Header>
              <Modal.Body>
                <form className="p-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                      <input type="number" name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$2999" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                      <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                        <option selected>Select category</option>
                        <option value="TV">TV/Monitors</option>
                        <option value="PC">PC</option>
                        <option value="GA">Gaming/Console</option>
                        <option value="PH">Phones</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Description</label>
                      <textarea id="description" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write product description here"></textarea>
                    </div>
                  </div>
                  <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                    Add new product
                  </button>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => setOpenModal(false)}>I accept</Button>
                <Button color="gray" onClick={() => setOpenModal(false)}>
                  Decline
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </table>
      </div>
    </Wrapper>
  );
};

export default ListUsers;
