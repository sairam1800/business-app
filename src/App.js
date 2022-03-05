import Home from "./home";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IsAuthenticated from "./user/isAuthenticated";
import Signin from "./user/signin";
import Workspace from "./admin/workspace";
import React, { Component } from "react";
import { Stockdata } from "./admin/stock";
import { Saledata } from "./admin/sale";
import { Billdata } from "./admin/bills";
import { Billing } from "./admin/billing";
import { WorkerBilling } from "./worker/billing";
import { Users } from "./admin/users";
import { Daily } from "./admin/daily";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      User: {},
      token: "",
    };
  }
  fun() {
    if (IsAuthenticated()) {
      const { token, User } = IsAuthenticated();
      return token, User;
      // this.setState({ token, User });
    }
  }
  render() {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<Home />} />

            <Route path="/signin" exact element={<Signin />} />
            {}
            <Route path="/workspace" exact element={<Workspace />} />

            <Route path="/workspace/stock" exact element={<Stockdata />} />
            <Route path="/workspace/sale" exact element={<Saledata />} />
            <Route path="/workspace/bills" exact element={<Billdata />} />
            <Route path="/workspace/billing" exact element={<Billing />} />
            <Route path="/workspace/users" exact element={<Users />} />
            <Route path="/workspace/daily" exact element={<Daily />} />

            <Route path="/worker" exact element={<WorkerBilling />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
