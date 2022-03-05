import React from "react";
import p from "./mahalakshmi.jpg";
import Head from "../head";

import { Navigate } from "react-router-dom";

import IsAuthenticated from "../user/isAuthenticated";
class Workspace extends React.Component {
  render() {
    if (IsAuthenticated()) {
      const { token, User } = IsAuthenticated();
      if (!User.isadmin) {
        return <Navigate to="/worker" />;
      }
    } else {
      return <Navigate to="/" />;
    }
    return (
      <>
        <header>{Head()}</header>

        <div className="d-flex justify-content-center">
          <img src={p} alt="Jai Shree Ram" />
        </div>
      </>
    );
  }
}

export default Workspace;
