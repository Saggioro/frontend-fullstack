import React, { useCallback } from "react";
import { FiUser, FiLock } from "react-icons/fi";

import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/auth";

import logoImg from "../../assets/stefanini.png";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AnimationContainer } from "./styles";
import { useState } from "react";
import getValidationErrors from "../../utils/getValidationErrors";

interface ErrorsValidation {
  [key: string]: string;
}
interface ICredentials {
  login: string;
  senha: string;
}

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<ICredentials>({
    login: "",
    senha: "",
  });

  const [errors, setErrors] = useState<ErrorsValidation>(
    {} as ErrorsValidation
  );
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const history = useHistory();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErrors({});
      setLoading(true);

      try {
        const schema = Yup.object().shape({
          login: Yup.string().required("Login obrigatório"),
          senha: Yup.string().required("Senha obrigatória"),
        });

        await schema.validate(credentials, {
          abortEarly: false,
        });

        await signIn(credentials);

        history.push("/dashboard");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          setErrors(errors);

          return;
        }

        toast.error(
          err?.response?.data?.errors[0]?.message ||
            "Parece que temos um problema em nossos servidores :("
        );
        setLoading(false);
      }
    },
    [signIn, history, credentials]
  );

  const handleChange = (event: any) => {
    const {
      target: { name, value },
    } = event;

    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Stefanini" />

          <form onSubmit={(e) => handleSubmit(e)}>
            <h1>Faça seu Login</h1>

            <Input
              name="login"
              icon={FiUser}
              placeholder="Login"
              type="text"
              value={credentials.login}
              error={errors.login}
              handleChange={handleChange}
            />

            <Input
              name="senha"
              icon={FiLock}
              type="password"
              placeholder="Senha"
              value={credentials.login}
              handleChange={handleChange}
              error={errors.senha}
            />

            <Button type="submit" loading={loading}>
              Entrar
            </Button>
          </form>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default Login;
