import Axios from "axios";
import React from "react";
import { Component } from "react/cjs/react.production.min";
import IsAuthenticated from "../user/isAuthenticated";
import { Navigate } from "react-router-dom";
import Head from "../head";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
var moment = require("moment");

export class Daily extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hbills: 0,
      htotal: 0,
      hprofit: 0,
      hrevenue: 0,
      arevenue: 0,
      abills: 0,
      atotal: 0,
      arevenue: 0,
      aprofit: 0,
      ltotal: 0,
      lbills: 0,
      lrevenue: 0,
      lprofit: 0,

      totalbills: 0,
      bills: 0,
      total: 0,
      profit: 0,
      revenue: 0,
      investment: 0,
      text: "",
      token: "",
      User: {},
      daily: [],
      sortname: "",
      sorttype: 1,
    };
  }

  daily = async () => {
    let a = await Dailydata(this.state.token);
    let totalbills = a.data.length;
    this.setState({ daily: a.data, totalbills }, () => {
      let total = 0,
        bills = 0,
        investment = 0,
        profit = 0,
        revenue = 0;
      let t = [...this.state.daily].sort((a, b) => {
        return b.total - a.total;
      });
      let r = [...this.state.daily].sort((a, b) => {
        return b.revenue - a.revenue;
      });
      let p = [...this.state.daily].sort((a, b) => {
        return a.profit - a.profit;
      });
      let b = [...this.state.daily].sort((a, b) => {
        return a.no - a.no;
      });
      console.log(b[b.length - 1]);
      this.state.daily &&
        this.state.daily.map((h) => {
          console.log(h);
          total = total + h.total;
          bills = bills + h.no;
          investment = investment + h.investment;
          revenue = revenue + h.revenue;
          profit = (revenue * 100) / investment;
          this.setState({
            htotal: t[0],
            hrevenue: r[0],
            hprofit: p[0],
            hbills: b[0],
            ltotal: t[t.length - 1],
            lbills: b[b.length - 1],
            lrevenue: r[r.length - 1],
            lprofit: p[p.length - 1],
            total,
            profit,
            revenue,
            investment,
            bills,
          });
        });
    });
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
              daily: this.state.daily.filter(function (data) {
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
  sort = (p) => {
    if (this.state.sorttype) {
      let sortedDescending = [...this.state.daily].sort((a, b) => {
        return a[p] - b[p];
      });
      this.setState({
        daily: sortedDescending,
        sortname: p,
        sorttype: 0,
      });
    } else {
      let sortedDescending = [...this.state.daily].sort((a, b) => {
        return b[p] - a[p];
      });
      this.setState({
        daily: sortedDescending,
        sortname: p,
        sorttype: 1,
      });
    }
  };
  sortdate = (p) => {
    if (this.state.sorttype) {
      let sortedDescending = [...this.state.daily].sort((a, b) => {
        return a[p].localeCompare(b[p]);
      });
      this.setState({
        daily: sortedDescending,
        sortname: p,
        sorttype: 0,
      });
    } else {
      let sortedDescending = [...this.state.daily].sort((a, b) => {
        return b[p].localeCompare(a[p]);
      });
      this.setState({
        daily: sortedDescending,
        sortname: p,
        sorttype: 1,
      });
    }
  };
  changetext = (e) => {
    this.setState({ text: e.target.value });
  };
  componentWillMount() {
    if (IsAuthenticated()) {
      const { token, User } = IsAuthenticated();

      this.setState({ token, User }, () => this.daily());
    }
  }
  render() {
    if (IsAuthenticated()) {
      const { User } = IsAuthenticated();
      if (!User.isadmin) {
        return <Navigate to="/worker" />;
      }
    } else {
      return <Navigate to="/" />;
    }
    const {
      sortname,
      sorttype,
      text,
      daily,
      total,
      profit,
      revenue,
      investment,
      bills,
      totalbills,
      hbills,
      htotal,
      hprofit,
      hrevenue,
      arevenue,
      aprofit,
      atotal,
      abills,
      ltotal,
      lbills,
      lprofit,
      lrevenue,
    } = this.state;
    return (
      <div>
        <header>{Head()}</header>
        {this.state.User && <h3 className="ps-3">hi {this.state.User.name}</h3>}

        <h2 className="text-center">Daily Business</h2>
        <div className="ps-3">
          <h6>
            Highest no. of bills are {hbills.no} on{" "}
            {moment(hbills.createdAt).format("DD-MM-YYYY")}, lowest no. of bills
            are {lbills.no} on {moment(lbills.createdAt).format("DD-MM-YYYY")}
          </h6>
          <h6>
            Highest total is {htotal.total} on{" "}
            {moment(htotal.createdAt).format("DD-MM-YYYY")}, lowest total is{" "}
            {ltotal.total} on {moment(ltotal.createdAt).format("DD-MM-YYYY")}
          </h6>
          <h6>
            Highest revenue is {hrevenue.revenue} on{" "}
            {moment(hrevenue.createdAt).format("DD-MM-YYYY")}, lowest revenue is{" "}
            {lrevenue.revenue} on{" "}
            {moment(lrevenue.createdAt).format("DD-MM-YYYY")}
          </h6>
          <h6>
            Highest profit is <strong>{hprofit.profit}%</strong> on{" "}
            {moment(hprofit.createdAt).format("DD-MM-YYYY")}, lowest profit is{" "}
            {lprofit.profit}% on{" "}
            {moment(lprofit.createdAt).format("DD-MM-YYYY")}
          </h6>
        </div>

        <input
          className="form-control"
          type="search"
          name="text"
          value={text}
          placeholder="Search"
          onChange={this.changetext}
        />
        {text && (
          <table className="table ps-3">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Date</th>
                <th scope="col">Bills</th>
                <th scope="col">Investment</th>
                <th scope="col">Total</th>
                <th scope="col">Revenue</th>
                <th scope="col">Profit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>

            <tbody>
              {daily
                .filter((item) => {
                  if (
                    item.createdAt.toLowerCase().includes(text.toLowerCase()) ||
                    item.no
                      .toString()
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    item.investment
                      .toString()
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    item.total
                      .toString()
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    item.revenue
                      .toString()
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    item.profit
                      .toString()
                      .toLowerCase()
                      .includes(text.toLowerCase())
                  ) {
                    return item;
                  }
                })
                .map((t, i) => (
                  <>
                    <tr key={t._id}>
                      <th key={i} scope="row">
                        {i + 1})
                      </th>
                      <td key={i + 1}>
                        {moment(t.createdAt).format("DD-MM-YYYY")}
                      </td>
                      <td key={i + 2}>₹{t.no}</td>
                      <td key={i + 3}>₹{t.investment} </td>
                      <td key={i + 8}>{t.total}</td>
                      {(() => {
                        if (t.revenue > 0) {
                          return (
                            <td
                              className="text-primary font-weight-bold"
                              key={i + 8}
                            >
                              <strong> ₹{t.revenue}</strong>
                            </td>
                          );
                        } else if (t.revenue < 0) {
                          return (
                            <td
                              className="text-danger font-weight-bold"
                              key={i + 9}
                            >
                              <strong>- ₹{-1 * t.revenue}</strong>
                            </td>
                          );
                        } else {
                          return (
                            <td
                              className="text-warning font-weight-bold"
                              key={i + 6}
                            >
                              <strong>₹0</strong>
                            </td>
                          );
                        }
                      })()}
                      {(() => {
                        if (t.profit > 0) {
                          return (
                            <td
                              className="text-primary font-weight-bold"
                              key={i + 8}
                            >
                              <strong>+{t.profit.toFixed(2)}%</strong>
                            </td>
                          );
                        } else if (t.profit < 0) {
                          return (
                            <td
                              className="text-danger font-weight-bold"
                              key={i + 9}
                            >
                              <strong>-{-1 * t.profit.toFixed(2)}%</strong>
                            </td>
                          );
                        } else {
                          return (
                            <td
                              className="text-warning font-weight-bold"
                              key={i + 6}
                            >
                              <strong>0%</strong>
                            </td>
                          );
                        }
                      })()}
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() =>
                            this.delete(
                              t._id,
                              moment(t.createdAt).format("DD-MM-YYYY")
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        )}
        {this.state.daily && (
          <table className=" table">
            <thead>
              <tr>
                <th className="card-text" scope="col">
                  No
                  <td style={{ color: "#8C32C2" }}>total {totalbills}</td>{" "}
                </th>
                <th
                  className="card-text"
                  scope="col"
                  onClick={() => this.sortdate("createdAt")}
                >
                  Date
                  {sortname === "createdAt" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "createdAt" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </th>
                <th
                  className="card-text"
                  scope="col"
                  onClick={() => this.sort("no")}
                >
                  bills
                  {sortname === "no" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "no" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                  <td style={{ color: "#8C32C2" }}>{bills}</td>{" "}
                </th>

                <th
                  className="card-text"
                  scope="col"
                  onClick={() => this.sort("investment")}
                >
                  investment
                  {sortname === "investment" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "investment" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                  <td style={{ color: "#8C32C2" }}>₹{investment}</td>{" "}
                </th>
                <th
                  className="card-text"
                  scope="col"
                  onClick={() => this.sort("total")}
                >
                  total
                  {sortname === "total" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "total" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                  <td style={{ color: "#8C32C2" }}>₹{total}</td>{" "}
                </th>
                <th
                  className="card-text"
                  scope="col"
                  onClick={() => this.sort("revenue")}
                >
                  revenue
                  {sortname === "revenue" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "revenue" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                  {revenue > 0 ? (
                    <td className="text-primary font-weight-bold" key={8}>
                      <strong style={{ color: "#22359B" }}>+ ₹{revenue}</strong>
                    </td>
                  ) : (
                    <td className="text-danger font-weight-bold" key={9}>
                      <strong>- ₹{-1 * revenue}</strong>
                    </td>
                  )}
                </th>
                <th
                  className="card-text"
                  scope="col"
                  onClick={() => this.sort("profit")}
                >
                  profit
                  {sortname === "profit" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "profit" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                  {profit > 0 ? (
                    <td className="text-primary font-weight-bold" key={8}>
                      <strong style={{ color: "#22359B" }}>
                        {profit.toFixed(2)}%
                      </strong>
                    </td>
                  ) : (
                    <td className="text-danger font-weight-bold" key={9}>
                      <strong>- {-1 * profit.toFixed(2)}%</strong>
                    </td>
                  )}
                </th>
                <th className="card-text" scope="col">
                  delete
                </th>
              </tr>
            </thead>
            {this.state.daily &&
              this.state.daily.map((a, i) => (
                <tbody>
                  <tr key={a._id}>
                    <th className="card-text" key={i} scope="row">
                      {i + 1})
                    </th>
                    <td key={i + 2}>
                      {moment(a.createdAt).format("DD-MM-YYYY")}
                    </td>
                    <td key={i + 1}>{a.no}</td>
                    <td key={i + 3}>₹{a.investment}</td>
                    <td key={i + 4}>₹{a.total}</td>
                    {(() => {
                      if (a.revenue > 0) {
                        return (
                          <td
                            className="text-primary font-weight-bold"
                            key={i + 8}
                          >
                            <strong> ₹{a.revenue}</strong>
                          </td>
                        );
                      } else if (a.revenue < 0) {
                        return (
                          <td
                            className="text-danger font-weight-bold"
                            key={i + 9}
                          >
                            <strong>- ₹{-1 * a.revenue}</strong>
                          </td>
                        );
                      } else {
                        return (
                          <td
                            className="text-warning font-weight-bold"
                            key={i + 6}
                          >
                            <strong>₹0</strong>
                          </td>
                        );
                      }
                    })()}
                    {(() => {
                      if (a.profit > 0) {
                        return (
                          <td
                            className="text-primary font-weight-bold"
                            key={i + 8}
                          >
                            <strong>+{a.profit.toFixed(2)}%</strong>
                          </td>
                        );
                      } else if (a.profit < 0) {
                        return (
                          <td
                            className="text-danger font-weight-bold"
                            key={i + 9}
                          >
                            <strong>-{-1 * a.profit.toFixed(2)}%</strong>
                          </td>
                        );
                      } else {
                        return (
                          <td
                            className="text-warning font-weight-bold"
                            key={i + 6}
                          >
                            <strong>0%</strong>
                          </td>
                        );
                      }
                    })()}

                    <td>
                      <button
                        type="button"
                        className="btn btn-danger text-right"
                        onClick={() =>
                          this.delete(
                            a._id,
                            moment(a.createdAt).format("DD-MM-YYYY")
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
          </table>
        )}
      </div>
    );
  }
}

async function Dailydata(token) {
  try {
    const res = await Axios({
      method: "get",
      url: `http://localhost:8000/daily/data`,
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
      url: `http://localhost:8000/daily/delete/${x}`,
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
