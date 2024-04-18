import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useState } from "react";

interface SignUpProps {
  onClose: () => void;
}

export default function SignUp({ onClose }: SignUpProps) {
  const [cep, setCep] = useState('');

  function limpaFormularioCep() {
    const ruaInput = document.getElementById('street') as HTMLInputElement;
    const complementoInput = document.getElementById('complemento') as HTMLInputElement;
    const bairroInput = document.getElementById('bairro') as HTMLInputElement;
    const cidadeInput = document.getElementById('cidade') as HTMLInputElement;
    const ufInput = document.getElementById('uf') as HTMLInputElement;
  
    if (ruaInput) ruaInput.value = "";
    if (complementoInput) complementoInput.value = "";
    if (bairroInput) bairroInput.value = "";
    if (cidadeInput) cidadeInput.value = "";
    if (ufInput) ufInput.value = "";
  }

  function preencherEndereco(conteudo: any) {
    const streetInput = document.getElementById('street') as HTMLInputElement | null;
    const bairroInput = document.getElementById('bairro') as HTMLInputElement | null;
    const cidadeInput = document.getElementById('cidade') as HTMLInputElement | null;
    const ufInput = document.getElementById('uf') as HTMLInputElement | null;
  
    if (!("erro" in conteudo)) {
      if (streetInput) streetInput.value = conteudo.logradouro;
      if (bairroInput) bairroInput.value = conteudo.bairro;
      if (cidadeInput) cidadeInput.value = conteudo.localidade;
      if (ufInput) ufInput.value = conteudo.uf;
    } else {
      limpaFormularioCep();
      alert("CEP não encontrado.");
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
          alert('Erro ao buscar o CEP. Por favor, tente novamente mais tarde.');
          console.error('Erro ao buscar o CEP:', error);
        });
    } else {
      limpaFormularioCep();
      alert('Formato de CEP inválido.');
    }
  }

  return (
    <Modal dismissible show={true} size="6xl" popup onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        {/* <div className="max-h-screen overflow-y-auto"> */}
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Crie sua conta no 4bits!
            </h3>
            <div className="flex gap-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Seu nome completo" />
                </div>
                <TextInput className="w-96" id="name" required />
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
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cpf" value="Seu CPF" />
              </div>
              <TextInput
                id="cpf"
                type="number"
                required
                placeholder="000.000.000-00"
              />
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
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Endereço
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="CEP" value="CEP" />
              </div>
              <TextInput className="w-44" id="cep" required value={cep}
                onChange={(e) => setCep(e.target.value)}
                onBlur={() => pesquisarCep(cep)} />
            </div>
            <div className="flex gap-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="Street Name" value="Logradouro" />
                </div>
                <TextInput
                  className="w-96"
                  id="street"
                  type="string"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="House number" value="Número" />
                </div>
                <TextInput id="street" type="string" required />
              </div>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="Complemento" value="Complemento" />
                </div>
                <TextInput
                  className="w-96"
                  id="complemento"
                  type="string"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="Bairro" value="Bairro" />
                </div>
                <TextInput
                  className="w-96"
                  id="bairro"
                  type="string"
                  required
                />
              </div>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="Cidade" value="Cidade" />
                </div>
                <TextInput
                  className="w-96"
                  id="cidade"
                  type="string"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="UF" value="UF" />
                </div>
                <Select className="w-40" id="cidades" required>
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
              <Button>Concluir cadastro</Button>
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
        {/* </div> */}
      </Modal.Body>
    </Modal>
  );
}
