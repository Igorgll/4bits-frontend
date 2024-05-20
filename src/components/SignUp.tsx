import { Button, Label, Modal, Select, TextInput, Spinner } from "flowbite-react";
import { useState } from "react";

interface SignUpProps {
  onClose: () => void;
}

export default function SignUp({ onClose }: SignUpProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationModal, setNotificationModal] = useState({
    show: false,
    title: '',
    message: '',
  });

  function limpaFormularioCep() {
    setStreet('');
    setComplemento('');
    setBairro('');
    setCidade('');
    setUf('');
  }

  function preencherEndereco(conteudo: any) {
    if (!("erro" in conteudo)) {
      setStreet(conteudo.logradouro);
      setBairro(conteudo.bairro);
      setCidade(conteudo.localidade);
      setUf(conteudo.uf);
    } else {
      limpaFormularioCep();
      setNotificationModal({
        show: true,
        title: 'Erro',
        message: 'CEP não encontrado.',
      });
    }
  }

  function pesquisarCep(valor: string) {
    const cepLimpo = valor.replace(/\D/g, '');

    if (cepLimpo.length === 8) {
      fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then((response) => response.json())
        .then((data) => preencherEndereco(data))
        .catch((error) => {
          limpaFormularioCep();
          setNotificationModal({
            show: true,
            title: 'Erro',
            message: 'Erro ao buscar o CEP. Por favor, tente novamente mais tarde.',
          });
          console.error('Erro ao buscar o CEP:', error);
        });
    } else {
      limpaFormularioCep();
      setNotificationModal({
        show: true,
        title: 'Erro',
        message: 'Formato de CEP inválido.',
      });
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setLoading(false);
      setNotificationModal({
        show: true,
        title: 'Erro',
        message: 'As senhas não coincidem!',
      });
      return;
    }

    const user = {
      nome,
      email,
      cpf,
      password,
      billingAddress: {
        cep,
        logradouro: street,
        numero,
        complemento,
        bairro,
        localidade: cidade,
        uf,
      },
      userAddress: [
        {
          cep,
          logradouro: street,
          numero,
          complemento,
          bairro,
          localidade: cidade,
          uf,
        }
      ]
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/users/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      setLoading(false);

      if (response.ok) {
        setNotificationModal({
          show: true,
          title: 'Sucesso',
          message: 'Usuário criado com sucesso!',
        });
        onClose();
      } else {
        setNotificationModal({
          show: true,
          title: 'Erro',
          message: 'Erro ao criar usuário. Por favor, tente novamente.',
        });
      }
    } catch (error) {
      setLoading(false);
      setNotificationModal({
        show: true,
        title: 'Erro',
        message: 'Erro ao criar usuário. Por favor, tente novamente.',
      });
      console.error("Erro ao criar usuário:", error);
    }
  };

  return (
    <>
      <Modal dismissible show={true} size="6xl" popup onClose={onClose}>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSignUp}>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Crie sua conta no 4bits!
              </h3>
              <div className="flex gap-6">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="Seu nome completo" />
                  </div>
                  <TextInput
                    className="w-96"
                    id="name"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email" value="Seu email" />
                  </div>
                  <TextInput
                    className="w-96"
                    id="email"
                    required
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="cpf" value="Seu CPF" />
                </div>
                <TextInput
                  id="cpf"
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" value="Sua senha" />
                </div>
                <TextInput
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="confirmPassword" value="Confirme sua senha" />
                </div>
                <TextInput
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Endereço
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="CEP" value="CEP" />
                </div>
                <TextInput
                  className="w-44"
                  id="cep"
                  required
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  onBlur={() => pesquisarCep(cep)}
                />
              </div>
              <div className="flex gap-6">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="street" value="Logradouro" />
                  </div>
                  <TextInput
                    className="w-96"
                    id="street"
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="numero" value="Número" />
                  </div>
                  <TextInput
                    id="numero"
                    type="text"
                    required
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="complemento" value="Complemento" />
                  </div>
                  <TextInput
                    className="w-96"
                    id="complemento"
                    type="text"
                    required
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="bairro" value="Bairro" />
                  </div>
                  <TextInput
                    className="w-96"
                    id="bairro"
                    type="text"
                    required
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="cidade" value="Cidade" />
                  </div>
                  <TextInput
                    className="w-96"
                    id="cidade"
                    type="text"
                    required
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="uf" value="UF" />
                  </div>
                  <Select
                    className="w-40"
                    id="uf"
                    required
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                  >
                    <option value="">Selecione uma UF</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </Select>
                </div>
              </div>
              <div className="w-full">
                <Button type="submit" disabled={loading}>
                  {loading && <Spinner size="sm" className="mr-2" />}
                  Concluir cadastro
                </Button>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                Já possui uma conta?&nbsp;
                <a
                  href="#"
                  className="text-cyan-700 hover:underline dark:text-cyan-500"
                >
                  Fazer login
                </a>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Notification Modal */}
      <Modal
        show={notificationModal.show}
        onClose={() => setNotificationModal({ show: false, title: '', message: '' })}
      >
        <Modal.Header>{notificationModal.title}</Modal.Header>
        <Modal.Body>
          <p>{notificationModal.message}</p>
        </Modal.Body>
      </Modal>
    </>
  );
}