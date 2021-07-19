import React from "react";
import { Switch } from "react-router-dom";

import Route from "./Route";

import Login from "../pages/Login";

import Dashboard from "../pages/Dashboard";
import FormPessoa from "../pages/Forms/Pessoa";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Login} />

      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route exact path="/formPessoa" component={FormPessoa} isPrivate />
      <Route exact path="/formPessoa/:id" component={FormPessoa} isPrivate />
      <Route exact path="/viewPessoa/:id" component={FormPessoa} isPrivate />
    </Switch>
  );
};

export default Routes;
