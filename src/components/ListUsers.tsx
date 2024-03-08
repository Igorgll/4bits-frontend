import React, { useState, useEffect } from "react";
import Wrapper from "./Wrapper";

interface UserDTO {
  name: string;
  email: string;
  password: string;
  admin: boolean;
  isActive: boolean;
}

const ListUsers = () => {
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
    <Wrapper className="bg-[#111827]">
      <div className="mt-4">
      <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-white">Nome</th>
              <th className="px-4 py-2 text-white">Email</th>
              <th className="px-4 py-2 text-white">Admin</th>
              <th className="px-4 py-2 text-white">Ativo</th>
              <th className="px-4 py-2 text-white">Alterar Usuário</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="border px-4 py-2 text-white">{user.name}</td>
                <td className="border px-4 py-2 text-white">{user.email}</td>
                <td className="border px-4 py-2 text-white">
                  {user.admin ? "Sim" : "Não"}
                </td>
                <td className="border px-4 py-2 flex items-center justify-center text-white">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <span className="ms-3 text-sm font-medium">Ativo</span>
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </td>
                <td className="border px-4 py-2 text-white">Alterar</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
};

export default ListUsers;
