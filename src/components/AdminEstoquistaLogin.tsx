import React, { useState } from "react";
import Wrapper from "./Wrapper";
import { Navigate } from "react-router";
import { Spinner } from "flowbite-react";
import { useAuth } from "./AuthContext";

interface AdminEstoquistaLoginProps {
  redirectToListProducts: () => void;
}

const AdminEstoquistaLogin: React.FC<AdminEstoquistaLoginProps> = ({ redirectToListProducts }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [redirect, setRedirect] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const credentials = btoa(`${email}:${password}`);
      
      // Tenta login como administrador
      const adminResponse = await fetch("http://localhost:8080/api/v1/admins/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${credentials}`
        },
        body: JSON.stringify({ email, password })
      });

      const adminSessionToken = adminResponse.headers.get("X-Auth-Token");

      if (adminResponse.ok && adminSessionToken) {
        const adminData = await (await fetch(`http://localhost:8080/api/v1/admins/email/${email}`, {
          headers: {
            "Authorization": `Basic ${credentials}`
          }
        })).json();
        
        const adminName = adminData.name;
        localStorage.setItem("authToken", adminSessionToken);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", "ROLE_ADMIN");
        localStorage.setItem("userName", adminName);
        login(email, adminSessionToken, "ROLE_ADMIN", adminName);
        setError(null);
        setRedirect(true);
        return;
      }

      // Se falhar como administrador, tenta login como estoquista
      const estoquistaResponse = await fetch("http://localhost:8080/api/v1/estoquistas/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${credentials}`
        },
        body: JSON.stringify({ email, password })
      });

      const estoquistaSessionToken = estoquistaResponse.headers.get("X-Auth-Token");

      if (estoquistaResponse.ok && estoquistaSessionToken) {
        const estoquistaData = await (await fetch(`http://localhost:8080/api/v1/estoquistas/email/${email}`, {
          headers: {
            "Authorization": `Basic ${credentials}`
          }
        })).json();

        const estoquistaName = estoquistaData.name;
        localStorage.setItem("authToken", estoquistaSessionToken);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", "ROLE_ESTOQUISTA");
        localStorage.setItem("userName", estoquistaName);
        login(email, estoquistaSessionToken, "ROLE_ESTOQUISTA", estoquistaName);
        setError(null);
        setRedirect(true);
        return;
      }

      setError("Falha ao autenticar usuário. Verifique suas credenciais.");
      setLoading(false);

    } catch (error) {
      console.error("Erro ao processar a solicitação:", error);
      setError("Erro ao processar a solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/options" />;
  }

  return (
    <Wrapper className="bg-[#111827]">
      <div className="flex items-center">
        <form className="w-80 mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu email</label>
            <input
              type="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="nome@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sua senha</label>
            <input
              type="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" light /> : "Acessar"}
          </button>
        </form>
      </div>
    </Wrapper>
  );
};

export default AdminEstoquistaLogin;