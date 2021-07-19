import React, { useCallback } from "react";
import { FiPower } from "react-icons/fi";

import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import Input from "../../../components/Input";
import Select from "../../../components/Input/Select";

import Button from "../../../components/Button";
import logoImg from "../../../assets/stefanini.png";
import { useAuth } from "../../../hooks/auth";
import { Container, Content, Header, HeaderContent } from "./styles";
import { useState } from "react";
import getValidationErrors from "../../../utils/getValidationErrors";
import { api } from "../../../services/api";
import { useEffect } from "react";

interface ErrorsValidation {
  [key: string]: string;
}

interface IEndereco {
  rua: string;
  numero?: number;
  bairro: string;
  cidade: string;
  cep: string;
  estado: string;
}
interface IPessoa {
  id?: string;
  nome: string;
  sexo?: "Feminino" | "Masculino";
  nascimento: Date;
  naturalidade?: string;
  nacionalidade?: string;
  cpf: string;
  email?: string;
  endereco: IEndereco;
}
interface IParams {
  id: string;
}

const Login: React.FC = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  console.log(location.pathname);
  const { id } = useParams<IParams>();

  const initialState: IPessoa = {
    nome: "",
    sexo: undefined,
    nascimento: new Date(),
    naturalidade: "",
    nacionalidade: "",
    cpf: "",
    email: "",
    endereco: {
      rua: "",
      numero: undefined,
      bairro: "",
      cidade: "",
      cep: "",
      estado: "",
    },
  };

  const [pessoa, setPessoa] = useState<IPessoa>(initialState);
  const [isEdditing, setIsEdditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const [errors, setErrors] = useState<ErrorsValidation>(
    {} as ErrorsValidation
  );
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErrors({});
      setLoading(true);

      try {
        const schema = Yup.object().shape({
          cpf: Yup.string()
            .required("CPF obrigatório")
            .length(11, "Deve conter 11 caracteres"),
          nome: Yup.string().required("Nome obrigatório"),
          nascimento: Yup.string().required("Nascimento obrigatório"),
          email: Yup.string().email("Email inválido"),
          endereco: Yup.object().shape({
            rua: Yup.string().required("Rua obrigatória"),
            numero: Yup.string().required("Número obrigatório"),
            bairro: Yup.string().required("Bairro obrigatório"),
            cidade: Yup.string().required("Cidade obrigatória"),
            cep: Yup.string()
              .required("CEP obrigatório")
              .length(8, "Deve conter 8 caracteres"),
            estado: Yup.string().required("Estado obrigatório"),
          }),
        });

        await schema.validate(pessoa, {
          abortEarly: false,
        });

        if (id) {
          await api.put("/pessoas", pessoa);
          toast.success("Cadastro atualizado com sucesso");
        } else {
          await api.post("/pessoas", pessoa);
          toast.success("Cadastro realizado com sucesso");
        }

        history.push("/dashboard");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          setErrors(errors);

          return;
        }

        const erros = err?.response?.data?.errors as any[];

        if (erros && erros.length > 0) {
          erros.forEach((erro) => {
            toast.error(erro.message);
          });
        } else {
          toast.error("Parece que temos um problema em nossos servidores :(");
        }
      } finally {
        setLoading(false);
      }
    },
    [history, pessoa, id]
  );

  const handleChange = (event: any, date?: Date, pickerName?: string) => {
    const {
      target: { name, value, className },
    } = event;

    if (pickerName && date) {
      setPessoa({
        ...pessoa,
        [pickerName]: new Date(date),
      });
    } else {
      if (className === "endereco") {
        console.log("aqui");
        console.log(pessoa);

        setPessoa({
          ...pessoa,
          endereco: {
            ...pessoa.endereco,
            [name]: value,
          },
        });
      } else {
        setPessoa({
          ...pessoa,
          [name]: value,
        });
      }
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`/pessoas/${id}`);
      setPessoa(response.data);
      if (location.pathname === `/viewPessoa/${id}`) {
        setIsViewing(true);
      } else {
        setIsEdditing(true);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.errors[0]?.message ||
          "Parece que temos um problema em nossos servidores :("
      );
    }
  };

  const inputs = [
    {
      name: "nome",
      placeholder: "Nome*",
      type: "text",
      value: pessoa.nome,
      error: errors.nome,
    },
    {
      name: "cpf",
      placeholder: "CPF*",
      type: "text",
      value: pessoa.cpf,
      error: errors.cpf,
      maxlength: 11,
      allow: "number",
      handleChange: handleChange,
    },
    {
      name: "email",
      placeholder: "Email",
      type: "text",
      value: pessoa.email,
      error: errors.email,
      handleChange: handleChange,
    },

    {
      name: "nascimento",
      handleChange: handleChange,
      type: "date",
      value: new Date(pessoa.nascimento),
      error: errors.nacimento,
    },

    {
      name: "nacionalidade",
      placeholder: "Nacionalidade",
      type: "text",
      value: pessoa.nacionalidade,
      error: errors.nacionalidade,
      handleChange: handleChange,
    },
    {
      name: "naturalidade",
      placeholder: "Naturalidade",
      type: "text",
      value: pessoa.naturalidade,
      error: errors.naturalidade,
      handleChange: handleChange,
    },
    {
      name: "sexo",
      placeholder: "Sexo",
      type: "select",
      value: pessoa.sexo,
      error: errors.sexo,
      handleChange: handleChange,
      selectOptions: [
        {
          name: "Selecione o sexo",
          value: "",
        },
        {
          name: "Masculino",
          value: "Masculino",
        },
        {
          name: "Feminino",
          value: "Feminino",
        },
      ],
    },
    {
      class: "endereco",
      name: "cep",
      placeholder: "CEP",
      type: "text",
      value: pessoa.endereco.cep,
      error: errors.cep,
      handleChange: handleChange,
      maxlength: 8,
    },
    {
      class: "endereco",
      name: "rua",
      placeholder: "Rua",
      type: "text",
      value: pessoa.endereco.rua,
      error: errors.rua,
      handleChange: handleChange,
    },
    {
      class: "endereco",
      name: "numero",
      placeholder: "Número",
      type: "number",
      value: pessoa.endereco.numero,
      error: errors.numero,
      handleChange: handleChange,
    },
    {
      class: "endereco",
      name: "bairro",
      placeholder: "Bairro",
      type: "text",
      value: pessoa.endereco.bairro,
      error: errors.bairro,
      handleChange: handleChange,
    },
    {
      class: "endereco",
      name: "cidade",
      placeholder: "Cidade",
      type: "text",
      value: pessoa.endereco.cidade,
      error: errors.cidade,
      handleChange: handleChange,
    },
    {
      class: "endereco",
      name: "estado",
      placeholder: "Estado",
      type: "text",
      value: pessoa.endereco.estado,
      error: errors.estado,
      handleChange: handleChange,
    },
  ];

  useEffect(() => {
    if (id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Stefanini" />

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <h2>
          {isEdditing && !isViewing && "Editar pessoa"}
          {!isEdditing && isViewing && "Visualizar pessoa"}
          {!isEdditing && !isViewing && "Cadastrar pessoa"}
        </h2>

        <form onSubmit={(e) => handleSubmit(e)}>
          {inputs.map((input) =>
            input.type === "select" ? (
              <Select
                key={input.name}
                name={input.name}
                placeholder={input.placeholder}
                value={input.value}
                handleChange={handleChange}
                error={input.error}
                selectOptions={input.selectOptions}
                disabled={isViewing}
              />
            ) : (
              <Input
                className={input.class}
                key={input.name}
                name={input.name}
                placeholder={input.placeholder}
                type={input.type}
                value={input.value}
                handleChange={handleChange}
                error={input.error}
                maxLength={input.maxlength}
                selectOptions={input.selectOptions}
                disabled={isViewing}
              />
            )
          )}

          {!isViewing && (
            <Button type="submit" loading={loading}>
              Cadastrar
            </Button>
          )}
        </form>
      </Content>
    </Container>
  );
};

export default Login;
