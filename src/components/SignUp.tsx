import { Button, Label, Modal, TextInput } from "flowbite-react";

interface SignUpProps {
  onClose: () => void;
}

export default function SignUp({ onClose }: SignUpProps){
  return (
    <Modal
      dismissible
      show={true}
      size="md"
      popup
      onClose={onClose}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Seja bem vindo ao 4bits!
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Seu nome" />
            </div>
            <TextInput
              id="name"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Seu email" />
            </div>
            <TextInput
              id="email"
              required
              placeholder="email@exemplo.com"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="cpf" value="Seu CPF" />
            </div>
            <TextInput id="cpf" type="cpf" required placeholder="000.000.000-00" />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Sua senha" />
            </div>
            <TextInput id="password" type="password" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="confirmPassword" value="Confirme sua senha" />
            </div>
            <TextInput id="confirmPassword" type="confirmPassword" required />
          </div>
          <div className="w-full">
            <Button>Concluir cadastro</Button>
          </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              Já possui uma conta?&nbsp;
              <a
                href="#"
                className="text-cyan-700 hover:underline dark:text-cyan-500"
              >
                Login
              </a>
            </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}