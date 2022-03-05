import React from "react";
import Axios from "axios";

import { Navigate } from "react-router-dom";

export default async function Signout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");

    try {
      const res = await Axios.get("http://localhost:8000/user/signout");
      console.log(res);
      console.log("signed out");
      return <Navigate to="/" />;
    } catch (err) {
      return console.log(err);
    }
  }
}
