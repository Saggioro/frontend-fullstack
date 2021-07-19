import React, { useCallback } from "react";
import { FiPower } from "react-icons/fi";

import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup";
import { useHistory, useParams } from "react-router-dom";
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
interface IPessoa {
  id?: string;
  nome: string;
  sexo?: "Feminino" | "Masculino";
  nascimento: Date;
  naturalidade?: string;
  nacionalidade?: string;
  cpf: string;
  email?: string;
}
interface IParams {
  id: string;
}

const Login: React.FC = () => {
  const { signOut } = useAuth();
  const { id } = useParams<IParams>();

  const initialState: IPessoa = {
    nome: "",
    sexo: undefined,
    nascimento: new Date(),
    naturalidade: "",
    nacionalidade: "",
    cpf: "",
    email: "",
  };

  const [pessoa, setPessoa] = useState<IPessoa>(initialState);
  const [isEdditing, setIsEdditing] = useState(false);

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
      target: { name, value },
    } = event;

    if (pickerName && date) {
      setPessoa({
        ...pessoa,
        [pickerName]: new Date(date),
      });
    } else {
      setPessoa({
        ...pessoa,
        [name]: value,
      });
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`/pessoas/${id}`);
      setPessoa(response.data);

      setIsEdditing(true);
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
        <h2>{isEdditing ? "Editar pessoa" : "Cadastrar pessoa"}</h2>

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
              />
            ) : (
              <Input
                key={input.name}
                name={input.name}
                placeholder={input.placeholder}
                type={input.type}
                value={input.value}
                handleChange={handleChange}
                error={input.error}
                maxLength={input.maxlength}
                selectOptions={input.selectOptions}
              />
            )
          )}

          <Button type="submit" loading={loading}>
            Cadastrar
          </Button>
        </form>
      </Content>
    </Container>
  );
};

export default Login;
