import Axios from "axios";
import React from "react";
import { Component } from "react/cjs/react.production.min";
import IsAuthenticated from "../user/isAuthenticated";
import { Navigate } from "react-router-dom";
import Head from "../head";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
var moment = require("moment");

export class Billdata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      User: {},
      billdata: [],
    };
    this.getbills = this.getbills.bind(this);
  }

  getbills = async () => {
    let a = await Getbills(this.state.token);
    this.setState({ billdata: a.data });
    console.log(a.data);
  };
  delete = async (x, n) => {
    confirmAlert({
      title: <h3 className="text-danger ">Warning</h3>,
      message: `Are you sure ${this.state.User.name}? Do you want to delete ${n}?`,
      buttons: [
        {
          label: <strong className="text-danger ">Delete</strong>,
          onClick: async () => {
            await delette(x, this.state.token);
            this.setState({
              billdata: this.state.billdata.filter(function (data) {
                return data._id !== x;
              }),
            });
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  componentWillMount() {
    if (IsAuthenticated()) {
      const { token, User } = IsAuthenticated();

      this.setState({ token, User }, () => this.getbills());
    }
  }
  render() {
    console.log(this.state.billdata);
    if (IsAuthenticated()) {
      const { User } = IsAuthenticated();
      if (!User.isadmin) {
        return <Navigate to="/worker" />;
      }
    } else {
      return <Navigate to="/" />;
    }
    return (
      <div>
        <header>{Head()}</header>
        {this.state.User && <h3>hi {this.state.User.name}</h3>}
        {moment().format("DD-MM-YYYY hh:mm:ss")}

        <h2 className="text-center">view your bills</h2>
        {this.state.billdata &&
          this.state.billdata.map((a, i) => (
            <div className="card col-mx-6 mx-5 px-5 text-center">
              <h5 className="card-header text-center">kushal shop</h5>
              <h5 className="card-header text-center">
                {moment(a.createdAt).format("DD-MM-YYYY, h:mm:ss a")}
              </h5>

              <div>
                <p>bill no: {i + 1}</p>
                <p>soled by: {a.soled_by_name}</p>
              </div>
              <table className=" table">
                <thead>
                  <tr>
                    <th className="card-text" scope="col">
                      No
                    </th>
                    <th className="card-text" scope="col">
                      Name
                    </th>
                    <th className="card-text" scope="col">
                      items
                    </th>
                    <th className="card-text" scope="col">
                      price
                    </th>
                    <th className="card-text" scope="col">
                      total
                    </th>
                  </tr>
                </thead>
                {a &&
                  a.list.map((b, j) => (
                    <tbody>
                      <tr key={a._id}>
                        <th className="card-text" key={j} scope="row">
                          {j + 1})
                        </th>
                        <td key={i + j + 1}>{b.name}</td>
                        <td key={i + j + 2}>{b.no_of_items}</td>
                        <td key={i + j + 3}>
                          <h6 className="text-success">
                            {b.min} to {b.max}
                          </h6>
                          ₹{b.soled_price}
                        </td>
                        <td key={i + j + 4}>
                          ₹{b.no_of_items * b.soled_price}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  ))}
              </table>
              <table className="table">
                <tr key={a._id}>
                  <th key={i} scope="row">
                    total products : {a.total_products}
                  </th>
                  <td key={i + 91}>{"          .          "}</td>
                  <td key={i + 92}>
                    <strong> total items : {a.total_items}</strong>
                  </td>
                  <td key={i + 93}>{"           .           "}</td>
                  <td key={i + 94}>
                    <strong>
                      total : ₹
                      {a.list.reduce(
                        (b, v) => (b = b + v.no_of_items * v.soled_price),
                        0
                      )}
                    </strong>
                  </td>
                </tr>
              </table>
              <button
                type="button"
                className="btn btn-danger text-right"
                onClick={() => this.delete(a._id)}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    );
  }
}

async function Getbills(token) {
  try {
    const res = await Axios({
      method: "get",
      url: `http://localhost:8000/bill/data`,
      // data: d, // you are sending body instead

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    return console.log(err);
  }
}
async function delette(x, token) {
  try {
    const res = await Axios({
      method: "get",
      url: `http://localhost:8000/bill/delete/${x}`,
      // data: d, // you are sending body instead

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    return console.log(err);
  }
}
