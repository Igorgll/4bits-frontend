import React, { useState } from "react";
import Wrapper from "./Wrapper";
import { Navigate } from "react-router";
import { Label, TextInput, Button } from "flowbite-react";

interface FormData {
  name: string;
  email: string;
  cpf: string;
  password: string;
  repeat_password: string;
  group: string;
}

interface SignUpFormProps {
  redirectToLogin: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ redirectToLogin }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    cpf: "",
    password: "",
    repeat_password: "",
    group: "",
  });

  const [redirect, setRedirect] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { name, email, cpf, password, repeat_password, group } = formData;
    if (!name || !email || !cpf || !password || !repeat_password || !group) {
      console.error("Todos os campos obrigatórios devem ser preenchidos");
      return;
    }

    if (password !== repeat_password) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/admins/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Usuário cadastrado com sucesso");
        setFormData({
          name: "",
          email: "",
          cpf: "",
          password: "",
          repeat_password: "",
          group: "",
        });
        setRedirect(true);
      } else {
        console.error("Falha ao registrar usuário");
      }
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
    }
  };

  if (redirect) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <Wrapper className="bg-[#111827]">
      <form className="flex flex-col gap-4 w-96 mx-auto border rounded-md border-slate-500 px-4 py-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name" value="Nome" />
          <TextInput
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email" value="Endereço de Email" />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="cpf" value="CPF" />
          <TextInput
            id="cpf"
            type="tel"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="group" value="Grupo" />
          <TextInput
            id="group"
            type="text"
            name="group"
            value={formData.group}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="password" value="Senha" />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="repeat_password" value="Confirmar Senha" />
          <TextInput
            id="repeat_password"
            type="password"
            name="repeat_password"
            value={formData.repeat_password}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit">Cadastrar</Button>
      </form>
    </Wrapper>
  );
};

export default SignUpForm;
