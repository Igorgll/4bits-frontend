import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useRef } from "react";

interface LoginProps {
  onClose: () => void;
}

export default function Login({ onClose }: LoginProps) {
  const emailInputRef = useRef<HTMLInputElement>(null);

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
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Sua senha" />
            </div>
            <TextInput id="password" type="password" required />
          </div>
          <div className="w-full">
            <Button>Efetuar login</Button>
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
