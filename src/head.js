import React from "react";
import "./App.css";
import Signout from "./user/signout";

function Head() {
  return (
    <nav className="row-md-5 header">
      <a href="/workspace" className="col c  ">
        <span className="btn ">Home</span>
      </a>
      <a href="/workspace/stock" className="col c">
        <span className="c btn  ">Stock</span>
      </a>
      <a href="/workspace/sale" className="col c">
        <span className="c btn  "> Sale</span>
      </a>
      <a href="/workspace/daily" className="col c">
        <span className="c btn  "> Daily</span>
      </a>
      <a href="/workspace/bills" className="col c">
        <span className="c btn  "> Bills</span>
      </a>
      <a href="/workspace/billing" className="col c">
        <span className="c btn  "> Billing</span>
      </a>
      <a href="/workspace/users" className="col c">
        <span className="c btn  "> Users</span>
      </a>
      <a href="/" className="col align-end c  p-2">
        <span
          className="  p-2 ui right floated clearing segment "
          onClick={() => Signout()}
        >
          <i className="right floated red power off icon large " />
        </span>
      </a>
    </nav>
  );
}

export default Head;
