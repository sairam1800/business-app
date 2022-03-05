import React, { Component } from "react";
import { Navigate } from "react-router-dom";

// import Head from "../head";

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      isadmin: false,
      signedup: false,
    };

    this.handleinput1 = this.handleinput1.bind(this);
    this.handleinput2 = this.handleinput2.bind(this);
    this.handleinput3 = this.handleinput3.bind(this);
    this.handleinput4 = this.handleinput4.bind(this);

    this.onsubmit = this.onsubmit.bind(this);
  }

  handleinput1 = (event) => {
    this.setState({ name: event.target.value });
  };
  handleinput2(event) {
    this.setState({ email: event.target.value });
  }
  handleinput3(event) {
    this.setState({ password: event.target.value });
  }
  handleinput4(event) {
    this.setState({ isadmin: event.target.value });
  }
  onsubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isadmin } = this.state;
    signup({ name, email, password, isadmin })
      .then((data) => {
        if (data.error) {
          return console.log(data.error);
        } else {
          console.log("signed up");

          return this.setState({ signedup: true });
        }
      })
      .catch((err) => console.log(err));
  };

  render() {
    if (this.state.signedup) {
      return <Navigate to="/signin" />;
    }
    return (
      <div>
        {/* {Head()} */}
        <form className="col-md-6 offset-sm-3">
          <div className="form-group">
            <label>Name</label>
            <input
              onChange={this.handleinput1}
              type="text"
              className="form-control"
              aria-describedby="emailHelp"
              defaultValue={this.state.name}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              onChange={this.handleinput2}
              type="email"
              className="form-control"
              aria-describedby="emailHelp"
              defaultValue={this.state.email}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              onChange={this.handleinput3}
              type="password"
              className="form-control"
              defaultValue={this.state.password}
            />
          </div>
          <div>
            <label class="screen-reader-only" for="choice">
              is it woner account?
            </label>
            <span aria-hidden="true">No</span>
            <input type="range" max="1" id="choice" name="choice" />
            <span aria-hidden="true">Yes</span>
          </div>
          <div>
            <button
              onClick={this.onsubmit}
              type="submit"
              className="btn btn-primary"
            >
              submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}
const signup = async (user) => {
  try {
    const response = await fetch("http://localhost:8000/user/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return console.log(err);
  }
};
