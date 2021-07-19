import React, { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import { FiPower, FiEdit, FiTrash } from "react-icons/fi";
import ListView from "../../components/ListView";
import { IColumn } from "../../components/Table";
import { useAuth } from "../../hooks/auth";

import { Container, Header, HeaderContent, Content } from "./styles";

import logoImg from "../../assets/stefanini.png";
import { api } from "../../services/api";
import { toast } from "react-toastify";

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
  const [fetchCount, setFetchCount] = useState(0);

  const removerPessoa = async (id: string) => {
    try {
      await api.delete(`/pessoas/${id}`);
      setFetchCount(fetchCount + 1);
      toast.success("Usuário deletado com sucesso");
    } catch (err) {
      const erros = err?.response?.data?.errors as any[];

      if (erros && erros.length > 0) {
        erros.forEach((erro) => {
          toast.error(erro.message);
        });
      } else {
        toast.error("Parece que temos um problema em nossos servidores :(");
      }
    }
  };

  const columns: IColumn[] = [
    {
      name: "nome",
      value: "Nome",
    },
    {
      name: "cpf",
      value: "CPF",
    },
    {
      name: "email",
      value: "Email",
    },
    {
      name: "sexo",
      value: "Sexo",
    },
    {
      name: "nascimento",
      value: "Nascimento",
      render: (nascimento: Date) => {
        return format(new Date(nascimento), "dd/MM/yyyy");
      },
    },
    {
      name: "naturalidade",
      value: "Naturalidade",
    },
    {
      name: "nacionalidade",
      value: "Nacionalidade",
    },
    {
      name: "id",
      value: "Ações",
      render: (id: string) => (
        <div>
          <button>
            <Link to={`/formPessoa/${id}`}>
              <FiEdit color="#7363ff" />
            </Link>
          </button>
          <button onClick={() => removerPessoa(id)}>
            <FiTrash color="#b32015" />
          </button>
        </div>
      ),
    },
  ];

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
        <button className="botaoCadastrar">
          <Link to="/formPessoa">Cadastrar Pessoa</Link>
        </button>
        <ListView
          columns={columns}
          endpoint="/pessoas"
          fetchCount={fetchCount}
        />
      </Content>
    </Container>
  );
};
export default Dashboard;
