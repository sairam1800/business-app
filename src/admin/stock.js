import Axios from "axios";
import React from "react";
import { Component } from "react/cjs/react.production.min";
import IsAuthenticated from "../user/isAuthenticated";
import { Navigate } from "react-router-dom";
import Head from "../head";
import "bootstrap/dist/css/bootstrap.css";
import "../App.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";

export class Stockdata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalitems: 0,
      qty: 0,
      investment: 0,
      search: false,
      low: false,
      sortname: "",
      sorttype: 1,
      lowstock: [],
      text: "",
      User: {},
      token: "",
      update: false,
      updateitem: "",
      updatedata: {
        name: "",
        actual_price: 0,
        selling_price_range: {
          min: 0,
          max: 0,
        },
        available: 0,
      },
      stockdata: [],
      showForm: false,
      input: {
        name: "",
        actual_price: 0,
        selling_price_range: {
          min: 0,
          max: 0,
        },
        available: 0,
      },
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
            const lowstock = this.state.lowstock.filter(
              (item) => item._id !== e
            );

            this.setState({ stockdata, lowstock });
          },
        },
        {
          label: "No",
        },
      ],
    });
  };
  updatestate = (a) => {
    console.log(`a:${a.name}`);
    console.log(this.state.updatedata);

    this.setState({
      updatedata: {
        name: a.name,
        actual_price: a.actual_price,
        selling_price_range: {
          min: a.selling_price_range.min,
          max: a.selling_price_range.max,
        },
        available: a.available,
      },
      // update: true,
      updateitem: a._id,
    });
    console.log(this.state.updateitem);
  };
  updateInputchange = (e) => {
    this.setState({
      updatedata: { ...this.state.updatedata, [e.target.name]: e.target.value },
    });
  };
  updaterangechange = (e) => {
    this.setState({
      updatedata: {
        ...this.state.updatedata,
        selling_price_range: {
          ...this.state.updatedata.selling_price_range,
          [e.target.name]: e.target.value,
        },
      },
    });
  };
  onInputchange = (e) => {
    this.setState({
      input: { ...this.state.input, [e.target.name]: e.target.value },
    });
  };
  rangechange = (e) => {
    if (e.target.name === "min") {
      this.setState(
        {
          input: {
            ...this.state.input,
            selling_price_range: {
              ...this.state.input.selling_price_range,
              min: e.target.value,
              max: e.target.value,
            },
          },
        },
        console.log(this.state.input)
      );
    } else {
      this.setState(
        {
          input: {
            ...this.state.input,
            selling_price_range: {
              ...this.state.input.selling_price_range,
              [e.target.name]: e.target.value,
            },
          },
        },
        console.log(this.state.input)
      );
    }
  };
  onSubmitForm = async () => {
    await createstock(this.state.input, this.state.token);
    this.setState(
      {
        input: {
          name: "",
          actual_price: 0,
          selling_price_range: {
            min: 0,
            max: 0,
          },
          showForm: false,
        },
      },
      () => {
        this.getstock();
      }
    );
  };
  onSubmitUpdate = async () => {
    console.log(this.state.updatedata);
    await updatestock(
      this.state.updateitem,
      this.state.updatedata,
      this.state.token
    );
    this.setState({ lowstock: [] });
    await this.getstock();
    this.setState({
      updatedata: {
        name: "",
        actual_price: 0,
        selling_price_range: {
          min: 0,
          max: 0,
        },
        available: 0,
      },
      search: false,
      low: false,
      update: false,
      updateitem: "",
    });
  };
  getstock = async () => {
    let c = [];

    let a = await Getstock(this.state.token);
    let totalitems = a.data.length;

    this.setState({ stockdata: a.data, totalitems }, () => {
      let investment = 0,
        qty = 0;
      this.state.stockdata &&
        this.state.stockdata.map((a) => {
          qty = qty + a.available;
          investment = investment + a.actual_price;

          this.setState({ qty, investment });
        });
    });

    a.data.forEach((b) => {
      if (b.available < 16) {
        c.push(b);
      }
    });

    if (c.length > 0) {
      let h = [...c].sort((a, b) => {
        return a.available - b.available;
      });
      return this.setState({ lowstock: h });
    }

    console.log(a.data);
  };
  showForm = () => {
    return (
      <div className="flex-d add">
        <button
          className="flex-d justify-content-end row h-100"
          onClick={() => this.setState({ showForm: false })}
        >
          close
        </button>
        <form className="row h-100">
          <div className="form-group row-1">
            <>
              <label> Name : </label>
              <input
                type="text"
                name="name"
                defaultValue={this.state.input.name}
                onChange={this.onInputchange}
              />
            </>
            <>
              <label> Actual price : </label>
              <input
                type="number"
                name="actual_price"
                defaultValue={this.state.input.actual_price}
                onChange={this.onInputchange}
              />
            </>
          </div>

          <div className="row h-100">
            selling price range
            <label>minimum : </label>
            <input
              type="number"
              name="min"
              defaultValue={this.state.input.selling_price_range.min}
              onChange={this.rangechange}
            />
            <label>maximum : </label>
            <input
              type="number"
              name="max"
              defaultValue={this.state.input.selling_price_range.max}
              onChange={this.rangechange}
            />
          </div>
          <div className="row h-100">
            <label>available : </label>
            <input
              type="number"
              name="available"
              defaultValue={this.state.input.available}
              onChange={this.onInputchange}
            />
          </div>
        </form>

        <button
          type="submit"
          className="btn btn-primary"
          onClick={this.onSubmitForm}
        >
          Create
        </button>
      </div>
    );
  };
  showupdateform = () => {
    return (
      <>
        <tr className="up ">
          <td></td>
          <td></td>
          <td></td>

          <h5>Update</h5>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>

        <tr className="u">
          <th key={8989} scope="row"></th>
          <td>
            <label> Name : </label>{" "}
            <input
              className="i"
              type="text"
              name="name"
              defaultValue={this.state.updatedata.name}
              onChange={this.updateInputchange}
            />
          </td>
          <td>
            <label> actual price : </label>{" "}
            <input
              className="i"
              type="number"
              name="actual_price"
              defaultValue={this.state.updatedata.actual_price}
              onChange={this.updateInputchange}
            />
          </td>
          <td>
            <tr>
              <label>selling price </label>
            </tr>{" "}
            <tr>
              {" "}
              <label>minimum : </label>{" "}
              <input
                className="i"
                type="number"
                name="min"
                defaultValue={this.state.updatedata.selling_price_range.min}
                onChange={this.updaterangechange}
              />
            </tr>
            <tr>
              <label>maximum : </label>{" "}
              <input
                className="i"
                type="number"
                name="max"
                defaultValue={this.state.updatedata.selling_price_range.max}
                onChange={this.updaterangechange}
              />
            </tr>
          </td>
          <td>
            <label>available : </label>{" "}
            <input
              className="i"
              type="number"
              name="available"
              defaultValue={this.state.updatedata.available}
              onChange={this.updateInputchange}
            />
          </td>
          <td>
            <button className="update" onClick={this.onSubmitUpdate}>
              update
            </button>
          </td>
          <button
            type="button"
            class="btn-close"
            onClick={() => this.setState({ update: false })}
            aria-label="Close"
          ></button>
          <td></td>
        </tr>
      </>
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
      showForm,
      User,
      stockdata,
      text,
      lowstock,
      sortname,
      sorttype,
      totalitems,
      qty,
      investment,
    } = this.state;

    if (IsAuthenticated()) {
      const { User } = IsAuthenticated();
      if (!User.isadmin) {
        return <Navigate to="/worker" />;
      }
    } else {
      console.log(IsAuthenticated());
      return <Navigate to="/" />;
    }
    return (
      <div>
        <>
          <header>{Head()}</header>
          <button
            type="button"
            className="btn btn-success ms-3"
            onClick={() => this.setState({ showForm: true })}
          >
            add stock
          </button>
          {showForm && this.showForm()}
        </>
        {User && <h3 className="ps-3">hi {User.name}</h3>}
        <div className="ps-3">
          <h6>You have total stock of {totalitems} </h6>
          <h6>You have invested ₹{investment} for your stock</h6>
          <h6>You have total {qty} of qty</h6>
        </div>
        {lowstock.length > 0 && (
          <>
            <h3 className="text-danger text-center">Low Stock</h3>
            <table className="table ">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Name</th>
                  <th scope="col">actual price</th>
                  <th scope="col">min price</th>
                  <th scope="col">to</th>
                  <th scope="col">max price</th>
                  <th scope="col">Qty</th>
                  <th scope="col">edit</th>
                </tr>
              </thead>

              {lowstock &&
                lowstock.map((a, i) => (
                  <tbody>
                    <tr key={a._id}>
                      <th key={i} scope="row">
                        {i + 1})
                      </th>
                      <td key={i + 1}>{a.name}</td>
                      <td key={i + 2}>₹{a.actual_price}</td>
                      <td key={i + 3}>₹{a.selling_price_range.min} </td>
                      <td key={i + 8}>to</td>
                      <td key={i + 9}>₹{a.selling_price_range.max}</td>
                      <td key={i + 4}>{a.available}</td>
                      <td>
                        <button
                          onClick={() => {
                            this.setState(
                              { search: false, update: false, low: true },
                              () => this.updatestate(a)
                            );
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          update
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => this.delete(a._id, a.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {this.state.low &&
                      !this.state.search &&
                      !this.state.update &&
                      this.state.updateitem &&
                      this.state.updateitem === a._id &&
                      this.showupdateform(a)}
                  </tbody>
                ))}
            </table>
          </>
        )}

        <h2 className="text-center">view your stock</h2>
        <input
          className="form-control"
          type="search"
          name="text"
          value={text}
          placeholder="Search"
          onChange={this.changetext}
        />
        {text && (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Name</th>
                <th scope="col">actual price</th>
                <th scope="col">min price</th>
                <th scope="col">to</th>
                <th scope="col">max price</th>
                <th scope="col">Qty</th>
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
                    item.available
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
                      <td key={i + 1}>{t.name}</td>
                      <td key={i + 2}>₹{t.actual_price}</td>
                      <td key={i + 3}>₹{t.selling_price_range.min} </td>
                      <td key={i + 8}>to</td>
                      <td key={i + 9}>₹{t.selling_price_range.max}</td>

                      <td key={i + 4}>{t.available}</td>
                      <td>
                        <button
                          onClick={() => {
                            this.setState(
                              { search: true, update: false, low: false },
                              () => this.updatestate(t)
                            );
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          update
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => this.delete(t._id, t.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>

                    {!this.state.low &&
                      this.state.search &&
                      !this.state.update &&
                      this.state.updateitem &&
                      this.state.updateitem === t._id &&
                      this.showupdateform(t)}
                  </>
                ))}
            </tbody>
          </table>
        )}
        <div>
          <table className="table  ">
            <thead>
              <tr>
                <th scope="col" onClick={() => this.sort("createdAt")}>
                  No
                  {sortname === "createdAt" && sorttype === 1 && (
                    <i className="bi bi-arrow-up">
                      <small>created at</small>
                    </i>
                  )}
                  {sortname === "createdAt" && sorttype === 0 && (
                    <i className="bi bi-arrow-down">
                      <small>created at</small>
                    </i>
                  )}
                </th>
                <th scope="col" onClick={() => this.sort("name")}>
                  Name{" "}
                  {sortname === "name" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "name" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </th>
                <th scope="col" onClick={() => this.sortnum1("actual_price")}>
                  actual price{" "}
                  {sortname === "actual_price" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "actual_price" && sorttype === 0 && (
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
                  max price{" "}
                  {sortname === "max" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "max" && sorttype === 0 && (
                    <i className="bi bi-arrow-down"></i>
                  )}
                </th>

                <th scope="col" onClick={() => this.sortnum1("available")}>
                  Qty{" "}
                  {sortname === "available" && sorttype === 1 && (
                    <i className="bi bi-arrow-up"></i>
                  )}
                  {sortname === "available" && sorttype === 0 && (
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
                    <td key={i + 2}>₹{a.actual_price}</td>
                    <td key={i + 3}>₹{a.selling_price_range.min} </td>
                    <td key={i + 8}>to</td>
                    <td key={i + 9}>₹{a.selling_price_range.max}</td>

                    <td key={i + 4}>{a.available}</td>
                    <td>
                      <button
                        onClick={() => {
                          this.setState(
                            { search: false, update: true, low: false },
                            () => this.updatestate(a)
                          );
                        }}
                        type="button"
                        className="btn btn-primary"
                      >
                        update
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => this.delete(a._id, a.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {!this.state.low &&
                    !this.state.search &&
                    this.state.update &&
                    this.state.updateitem &&
                    this.state.updateitem === a._id &&
                    this.showupdateform(a)}
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
      url: `http://localhost:8000/stock/data`,
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
async function createstock(x, token) {
  const res = await Axios({
    method: "post",
    url: "http://localhost:8000/stock/create",
    data: x, // you are sending body instead
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(x),
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      alert(error);
    });
  console.log(res);
  console.log("submit form");
}
async function updatestock(x, d, token) {
  console.log(
    `update id=${JSON.stringify(x)}, update data= ${JSON.stringify(d)}`
  );

  console.log("axios update");
  const res = await Axios({
    method: "put",
    url: `http://localhost:8000/stock/update/${x}`,
    data: d, // you are sending body instead
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(d),
  })
    .then((response) => {
      console.log("Done axios update");

      console.log(response);
    })
    .catch((error) => {
      alert(error);
    });
  console.log(res);
  console.log("submit update");
}
async function deletestock(x, token) {
  try {
    const res = await Axios({
      method: "get",
      url: `http://localhost:8000/stock/delete/${x}`,
      // data: d, // you are sending body instead
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
