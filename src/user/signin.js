import { Navigate } from "react-router-dom";

import React, { Component } from "react";
import IsAuthenticated from "./isAuthenticated";
var user;

if (IsAuthenticated()) {
  user = JSON.parse(localStorage.getItem("jwt")).User._id;
  console.log(user);
}
export default class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      signedin: false,
      User: {},
      token: "",
    };
    this.handleinput1 = this.handleinput1.bind(this);
    this.handleinput2 = this.handleinput2.bind(this);
    this.onsubmit = this.onsubmit.bind(this);
  }

  handleinput1 = (event) => {
    this.setState({ email: event.target.value });
  };
  handleinput2(event) {
    this.setState({ password: event.target.value });
  }
  onsubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    signin({ email, password })
      .then((data) => {
        if (data.error) {
          return console.log(data.error);
        }

        authenticate(data);
        console.log(data);

        this.setState({ signedin: true });
        return data.User.isadmin ? (
          <Navigate to="/workspace" />
        ) : (
          <Navigate to="/worker" />
        );
      })
      .catch((err) => console.log(err));
  };

  render() {
    if (IsAuthenticated()) {
      const { User } = IsAuthenticated();

      if (User.isadmin) return <Navigate to="/workspace" />;
      return <Navigate to="/worker" />;
    }

    return (
      <div className="text-center">
        <div style={{ color: "#D2691E" }} className="mt-5">
          <h3>सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज |</h3>
          <h3>अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुच: ||</h3>
        </div>
        <form className="col-md-6 offset-sm-3">
          <div className="form-group">
            <label>Email</label>
            <input
              onChange={this.handleinput1}
              type="text"
              className="form-control"
              aria-describedby="emailHelp"
              defaultValue={this.state.email}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              onChange={this.handleinput2}
              type="password"
              className="form-control"
              defaultValue={this.state.password}
            />
          </div>
          <div className="mt-5">
            <img
              src={require("../rama.jpg")}
              alt="శ్రీరామ"
              onClick={this.onsubmit}
            />
          </div>
        </form>
      </div>
    );
  }
}

const signin = async (user) => {
  try {
    const response = await fetch("http://localhost:8000/user/signin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(user),
    });
    console.log({ response });
    const data = await response.json();
    return data;
  } catch (err) {
    return console.log(err);
  }
};
const authenticate = (data) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
  }
};
