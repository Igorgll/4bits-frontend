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
        const response = await fetch("http://localhost:8080/api/v1/users/listUsersBasicInfo");
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
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="border px-4 py-2 text-white">{user.name}</td>
                <td className="border px-4 py-2 text-white">{user.email}</td>
                <td className="border px-4 py-2 text-white">{user.admin ? "Sim" : "Não"}</td>
                <td className="border px-4 py-2 text-white">{user.isActive ? "Sim" : "Não"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
};

export default ListUsers;
