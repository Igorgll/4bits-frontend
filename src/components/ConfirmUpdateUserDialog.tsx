import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

interface UserDTO {
  userId: number;
  name: string;
  email: string;
  cpf: string;
  group: string;
  password: string;
  isActive: boolean;
}

interface Props {
  user: UserDTO;
  onClose: () => void;
  onUpdateUser: () => void;
}

const ConfirmUpdateUserDialog: React.FC<Props> = ({ user, onClose, onUpdateUser }) => {
  return (
    <>
      <Modal show={true} size="md" onClose={onClose} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Confirma que deseja alterar o usuário {user.name} ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="success" onClick={onUpdateUser}>
                Sim, tenho certeza
              </Button>
              <Button color="failure" onClick={onClose}>
                Não, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConfirmUpdateUserDialog;
