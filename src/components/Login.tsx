import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { Spinner } from "flowbite-react";

interface LoginProps {
  onClose: () => void;
}

export default function Login({ onClose }: LoginProps) {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;

    if (!email || !password) {
      setError("Email e senha são obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1/users/clientLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Falha no login");
      }

      const sessionToken = response.headers.get("X-Auth-Token");
      if (sessionToken) {
        localStorage.setItem("sessionToken", sessionToken);

        // Fetch user details
        const userResponse = await fetch(`http://localhost:8080/api/v1/users/email/${email}`, {
          headers: {
            "Authorization": `Bearer ${sessionToken}`
          }
        });

        if (!userResponse.ok) {
          throw new Error("Falha ao obter detalhes do usuário");
        }

        const userData = await userResponse.json();
        const userName = userData.name; // Assumindo que o nome do usuário está no atributo 'name'
        localStorage.setItem("userName", userName); // Armazena o nome do usuário

        setError(null);
        login(email, sessionToken, "ROLE_USER", userName); // Atualiza o contexto de autenticação com o nome
        onClose();
      } else {
        setError("Falha no login. Verifique seu login.");
      }
    } catch (error) {
      setError("Falha no login. Verifique seu login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      dismissible
      show={true}
      size="md"
      popup
      onClose={onClose}
      initialFocus={emailInputRef}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Seja bem vindo ao 4bits!
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Seu email" />
            </div>
            <TextInput
              id="email"
              ref={emailInputRef}
              placeholder="email@exemplo.com"
              required
              disabled={loading}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Sua senha" />
            </div>
            <TextInput
              id="password"
              type="password"
              ref={passwordInputRef}
              required
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <div className="w-full">
            <Button onClick={handleLogin} disabled={loading}>
              {loading ? <Spinner size="sm" light /> : "Efetuar login"}
            </Button>
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
            Não possui uma conta?&nbsp;
            <a
              href="#"
              className="text-cyan-700 hover:underline dark:text-cyan-500"
            >
              Cadastre-se
            </a>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
