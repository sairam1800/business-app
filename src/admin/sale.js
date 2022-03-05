import Axios from "axios";
import React from "react";
import { Component } from "react/cjs/react.production.min";
import IsAuthenticated from "../user/isAuthenticated";
import { Navigate } from "react-router-dom";
import Head from "../head";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";

export class Saledata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hrevenue: {},
      saleditem: {},
      sortname: "",
      sorttype: 1,
      text: "",
      total: 0,
      revenue: 0,
      profit: 0,
      token: "",
      User: {},

      stockdata: [],
    };
  }
  sort = (p) => {
    if (this.state.sorttype) {
      let sortedDescending = [...this.state.stockdata].sort((a, b) => {
        return a[p].localeCompare(b[p]);
      });
      this.setState({
        stockdata: sortedDescending,
        sortname: p,
        sorttype: 0,
      });
    } else {
      let sortedDescending = [...this.state.stockdata].sort((a, b) => {
        return b[p].localeCompare(a[p]);
      });
      this.setState({
        stockdata: sortedDescending,
        sortname: p,
        sorttype: 1,
      });
    }
  };
  sortnum0 = (p, x) => {
    if (this.state.sorttype) {
      let sortedDescending = [...this.state.stockdata].sort((a, b) => {
        return a[p][x].localeCompare(b[p][x]);
      });
      this.setState({
        stockdata: sortedDescending,
        sortname: x,
        sorttype: 0,
      });
    } else {
      let sortedDescending = [...this.state.stockdata].sort((a, b) => {
        return b[p][x].localeCompare(a[p][x]);
      });
      this.setState({
        stockdata: sortedDescending,
        sortname: x,
        sorttype: 1,
      });
    }
  };
  sortnum = (p, x) => {
    if (this.state.sorttype) {
      let sortedDescending = [...this.state.stockdata].sort((a, b) => {
        return a[p][x] - b[p][x];
      });
      this.setState({
        stockdata: sortedDescending,
        sortname: x,
        sorttype: 0,
      });
    } else {
      let sortedDescending = [...this.state.stockdata].sort((a, b) => {
        return b[p][x] - a[p][x];
      });
      this.setState({
        stockdata: sortedDescending,
        sortname: x,
        sorttype: 1,
      });
    }
  };
  sortnum1 = (p) => {
    if (this.state.sorttype) {
      let sortedDescending = [...this.state.stockdata].sort((a, b) => {
        return a[p] - b[p];
      });
      this.setState({
        stockdata: sortedDescending,
        sortname: p,
        sorttype: 0,
      });
    } else {
      let sortedDescending = [...this.state.stockdata].sort((a, b) => {
        return b[p] - a[p];
      });
      this.setState({
        stockdata: sortedDescending,
        sortname: p,
        sorttype: 1,
      });
    }
  };
  changetext = (e) => {
    this.setState({ text: e.target.value });
  };
  delete = async (e, n) => {
    confirmAlert({
      title: <h3 className="text-danger ">Warning</h3>,
      message: `Are you sure ${this.state.User.name}? Do you want to delete ${n}?`,
      buttons: [
        {
          label: <strong className="text-danger ">Delete</strong>,
          onClick: async () => {
            await deletestock(e, this.state.token);
            const stockdata = this.state.stockdata.filter(
              (item) => item._id !== e
            );
            this.setState({ stockdata: stockdata }, () => {
              let total = 0,
                profit = 0,
                revenue = 0;
              this.state.stockdata &&
                this.state.stockdata.map((a) => {
                  console.log(a);
                  total = total + a.total;
                  revenue = revenue + a.revenue;

                  profit = (revenue * 100) / (total - revenue);
                  this.setState({ total, profit, revenue });
                });
            });
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  getstock = async () => {
    let a = await Getstock(this.state.token);
    let y = [...a.data];
    let r = [...y].sort((c, b) => {
      return b.revenue - c.revenue;
    });
    let si = [...y].sort((c, b) => {
      return b.number_of_items - c.number_of_items;
    });
    this.setState(
      { stockdata: a.data, hrevenue: r[0], saleditem: si[0] },
      () => {
        let total = 0,
          profit = 0,
          revenue = 0;
        this.state.stockdata &&
          this.state.stockdata.map((a) => {
            console.log(a);
            total = total + a.total;
            revenue = revenue + a.revenue;
            profit = (revenue * 100) / (total - revenue);
            this.setState({ total, profit, revenue });
          });
      }
    );
  };

  componentWillMount() {
    if (IsAuthenticated()) {
      const { token, User } = IsAuthenticated();

      this.setState({ token, User }, () => this.getstock());
    }
  }

  render() {
    const {
      profit,
      total,
      revenue,
      stockdata,
      text,
      sortname,
      sorttype,
      hrevenue,
      saleditem,
    } = this.state;
    if (IsAuthenticated()) {
      const { token, User } = IsAuthenticated();
      if (!User.isadmin) {
        return <Navigate to="/worker" />;
      }
    } else {
      return <Navigate to="/" />;
    }

    return (
      <div>
        <header>{Head()}</header>
        {hrevenue && saleditem && (
          <>
            <h5>
              Highest Revenue is from {hrevenue.name}= {hrevenue.revenue}{" "}
            </h5>
            <h5>
              Highest Soled item is {saleditem.name}={saleditem.number_of_items}
            </h5>
          </>
        )}
        <h2 className="text-center">view your sale</h2>
        <div>
          {stockdata && (
            <strong className="text-center">
              Total Items: {stockdata.length}
            </strong>
          )}
          <input
            className="form-control"
            type="search"
            name="text"
            value={text}
            placeholder="Search"
            onChange={this.changetext}
          />
          {text && (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Soled price</th>
                  <th scope="col">min price</th>
                  <th scope="col">to</th>
                  <th scope="col">max price</th>
                  <th scope="col">actual price</th>
                  <th scope="col">total</th>
                  <th scope="col">revenue</th>
                  <th scope="col">profit %</th>
                  <th scope="col">soled by</th>
                  <th scope="col">edit</th>
                </tr>
              </thead>

              <tbody>
                {stockdata
                  .filter((item) => {
                    if (
                      item.name.toLowerCase().includes(text.toLowerCase()) ||
                      item.actual_price
                        .toString()
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      item.number_of_items
                        .toString()
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      item.soled_price.price
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
                      item.soled_price.profit
                        .toString()
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      item.soled_by.name
                        .toLowerCase()
                        .includes(text.toLowerCase())
                    ) {
                      return item;
                    }
                  })
                  .map((a, i) => (
                    <>
                      <tr key={a._id}>
                        <th key={i} scope="row">
                          {i + 1})
                        </th>
                        <td key={i + 18181}>{a.name}</td>
                        <td key={i + 112}>{a.number_of_items}</td>
                        <td
                          key={i + 13}
                          className="text-success font-weight-bold"
                        >
                          ₹
                          <strong className="text-primary">
                            {a.soled_price.price}
                          </strong>
                        </td>

                        <td key={i + 114}>₹{a.selling_price_range.min}</td>
                        <td key={i + 15}>to</td>
                        <td key={i + 16}>₹{a.selling_price_range.max}</td>
                        <td className="text-info" key={i + 7}>
                          ₹{a.actual_price}
                        </td>
                        <td key={i + 199}>₹{a.total}</td>

                        {(() => {
                          if (a.revenue > 0) {
                            return (
                              <td
                                className="text-primary font-weight-bold"
                                key={i + 18}
                              >
                                <strong> ₹{a.revenue}</strong>
                              </td>
                            );
                          } else if (a.revenue < 0) {
                            return (
                              <td
                                className="text-danger font-weight-bold"
                                key={i + 1119}
                              >
                                <strong>- ₹{-1 * a.revenue}</strong>
                              </td>
                            );
                          } else {
                            return (
                              <td
                                className="text-warning font-weight-bold"
                                key={i + 10196}
                              >
                                <strong>₹0</strong>
                              </td>
                            );
                          }
                        })()}
                        {(() => {
                          if (a.soled_price.profit > 0) {
                            return (
                              <td
                                className="text-primary font-weight-bold"
                                key={i + 199198}
                              >
                                <strong>
                                  +{a.soled_price.profit.toFixed(2)}%
                                </strong>
                              </td>
                            );
                          } else if (a.soled_price.profit < 0) {
                            return (
                              <td
                                className="text-danger font-weight-bold"
                                key={i + 1181189}
                              >
                                <strong>
                                  -{-1 * a.soled_price.profit.toFixed(2)}%
                                </strong>
                              </td>
                            );
                          } else {
                            return (
                              <td
                                className="text-warning font-weight-bold"
                                key={i + 1191181176}
                              >
                                <strong>0%</strong>
                              </td>
                            );
                          }
                        })()}
                        <td key={i + 1716157}>{a.soled_by.name}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => this.delete(a._id, a.name)}
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
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col" onClick={() => this.sort("name")}>
                  Name{" "}
                  {sortname === "name" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "name" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </th>
                <th
                  scope="col"
                  onClick={() => this.sortnum1("number_of_items")}
                >
                  Qty
                  {sortname === "number_of_items" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "number_of_items" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </th>
                <th
                  scope="col"
                  className="text-primary"
                  onClick={() => this.sortnum("soled_price", "price")}
                >
                  soled price
                  {sortname === "price" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "price" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </th>
                <th
                  scope="col"
                  onClick={() => this.sortnum("selling_price_range", "min")}
                >
                  min price
                  {sortname === "min" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "min" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </th>
                <th scope="col">to</th>
                <th
                  scope="col"
                  onClick={() => this.sortnum("selling_price_range", "max")}
                >
                  max price
                  {sortname === "max" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "max" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </th>
                <th
                  scope="col"
                  className="text-info"
                  onClick={() => this.sortnum1("actual_price")}
                >
                  actual price
                  {sortname === "actual_price" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "actual_price" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </th>
                <th scope="col" onClick={() => this.sortnum1("total")}>
                  total
                  {sortname === "total" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "total" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                  <td style={{ color: "#8C32C2" }}>₹{total}</td>{" "}
                </th>
                <th scope="col" onClick={() => this.sortnum1("revenue")}>
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
                  scope="col"
                  onClick={() => this.sortnum("soled_price", "profit")}
                >
                  profit %
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

                <th
                  scope="col"
                  onClick={() => this.sortnum0("soled_by", "name")}
                >
                  soled by{" "}
                  {sortname === "name" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "name" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </th>
                <th scope="col">edit</th>
              </tr>
            </thead>
            {this.state.stockdata &&
              this.state.stockdata.map((a, i) => (
                <tbody>
                  <tr key={a._id}>
                    <th key={i} scope="row">
                      {i + 1})
                    </th>
                    <td key={i + 1}>{a.name}</td>
                    <td key={i + 2}>{a.number_of_items}</td>
                    <td key={i + 3} className="text-success font-weight-bold">
                      ₹
                      <strong className="text-primary">
                        {a.soled_price.price}
                      </strong>
                    </td>

                    <td key={i + 4}>₹{a.selling_price_range.min}</td>
                    <td key={i + 5}>to</td>
                    <td key={i + 6}>₹{a.selling_price_range.max}</td>
                    <td className="text-info" key={i + 7}>
                      ₹{a.actual_price}
                    </td>
                    <td key={i + 99}>₹{a.total}</td>

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
                      if (a.soled_price.profit > 0) {
                        return (
                          <td
                            className="text-primary font-weight-bold"
                            key={i + 8}
                          >
                            <strong>+{a.soled_price.profit.toFixed(2)}%</strong>
                          </td>
                        );
                      } else if (a.soled_price.profit < 0) {
                        return (
                          <td
                            className="text-danger font-weight-bold"
                            key={i + 9}
                          >
                            <strong>
                              -{-1 * a.soled_price.profit.toFixed(2)}%
                            </strong>
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
                    <td key={i + 7}>{a.soled_by.name}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => this.delete(a._id, a.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
          </table>
        </div>
      </div>
    );
  }
}

async function Getstock(token) {
  try {
    const res = await Axios({
      method: "get",
      url: `http://localhost:8000/sale/data`,
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

async function deletestock(x, token) {
  try {
    const res = await Axios({
      method: "get",
      url: `http://localhost:8000/sale/delete/${x}`,
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    console.log("deleted item");

    return res;
  } catch (err) {
    return console.log(err);
  }
}
