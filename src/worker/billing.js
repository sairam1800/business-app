import Axios from "axios";
import React from "react";
import "../App.css";
import { Navigate } from "react-router-dom";
import { Component } from "react/cjs/react.production.min";
import IsAuthenticated from "../user/isAuthenticated";
import Signout from "../user/signout";

var moment = require("moment");

export class WorkerBilling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      User: {},
      qty: 1,
      total: 0,
      value: 0,
      text: "",
      item: {},
      searchdata: {},
      daily: [],
      formdata: [],
      billdata: [],
      stockdata: [],
      saledata: [],
    };
  }

  postbills = () => {
    let s = 0;
    this.state.formdata.map((c) => {
      s = s + c.no_of_items;
    });
    let c = {
      total_products: this.state.formdata.length,
      total_items: s,
      total: this.state.total,
      list: this.state.formdata,
    };
    return postbill(c, this.state.token);
  };
  update = async () => {
    let s = 0;
    this.state.formdata.map((c) => {
      s = s + c.no_of_items;
    });
    let c = {
      soled_by_id: this.state.User._id,
      soled_by_name: this.state.User.name,
      total_products: this.state.formdata.length,
      total_items: s,
      total: this.state.total,
      list: this.state.formdata,
    };
    let inv = 0;

    for (let i = 0; i < this.state.formdata.length; i++) {
      inv +=
        this.state.formdata[i].actual_price *
        this.state.formdata[i].no_of_items;
    }
    if (
      this.state.daily &&
      this.state.daily[0] &&
      moment(this.state.daily[0].createdAt).format("DD-MM-YYYY") ===
        moment().format("DD-MM-YYYY")
    ) {
      await updateDaily(
        this.state.daily[0]._id,
        this.state.total,
        inv,
        this.state.token
      );
    } else {
      await Daily(this.state.token, inv, this.state.total);
    }

    await postbill(c, this.state.token);
    for (let i = 0; i < this.state.formdata.length; i++) {
      await Updatestock(
        this.state.formdata[i].id,
        this.state.formdata[i].no_of_items,
        this.state.token
      );
      await findbyid(
        this.state.saledata,
        this.state.formdata[i],
        this.state.token
      );
    }

    await this.getsale();
    await this.getstock();
    await this.getdaily();

    return this.setState({ formdata: [] });
  };

  total = () => {
    if (this.state.formdata) {
      let s = 0;
      this.state.formdata.map((c) => {
        s = s + c.total;
      });
      return this.setState({ total: s });
    }
  };
  changetext = (e) => {
    this.setState({ text: e.target.value });
  };
  getstock = async () => {
    let a = await Getstock(this.state.token);
    this.setState({ stockdata: a.data });
  };
  getsale = async () => {
    let b = await Getsale(this.state.token);
    this.setState({ saledata: b.data });
  };
  getdaily = async () => {
    let b = await Getdaily(this.state.token);
    this.setState({ daily: b.data });
  };
  checkAvailability(formd, t) {
    return formd.some(function (s) {
      return t._id === s.id;
    });
  }

  componentWillMount() {
    if (IsAuthenticated()) {
      const { token, User } = IsAuthenticated();

      this.setState(
        { token, User },
        () => this.getstock() && this.getsale() && this.getdaily()
      );
    }
  }

  render() {
    let { stockdata, User, text, daily, formdata } = this.state;
    console.log(formdata);

    if (IsAuthenticated()) {
      const { User } = IsAuthenticated();
      if (User.isadmin) {
        return <Navigate to="/workspace" />;
      }
    } else {
      return <Navigate to="/" />;
    }

    return (
      <div>
        <p className="p-2 ui ">Hi {this.state.User.name}</p>
        <a href="/" className=" right floated container ">
          <span
            className="ui right floated clearing segment "
            onClick={() => Signout()}
          >
            {" "}
            <i className=" right floated red power off icon large " />
          </span>
        </a>
        <div className=" table mx-auto mp-5 center floated container">
          <div>
            <h5 className="text-center ps-5 ui green text">Start Billing</h5>
          </div>
          <section className="flex flex-col text-end justify-end px-3 ">
            {User && <p>Billed by : {User.name}</p>}
            <p>
              Bill no :
              {daily &&
              daily[0] &&
              moment(daily[0].createdAt).format("DD-MM-YYYY") ===
                moment().format("DD-MM-YYYY")
                ? daily[0].no + 1
                : 0}
            </p>
            <p>invoice no: </p>
            <p className="justify-start">
              Date :{moment().format("DD-MM-YYYY")}
            </p>
            <p>Time :{moment().format("hh:mm:ss")}</p>
          </section>
          <div>
            {formdata[0] && (
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
                      Qty
                    </th>
                    <th className="card-text" scope="col">
                      price
                    </th>
                    <th className="card-text" scope="col">
                      total
                    </th>
                    <th className="card-text" scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {formdata &&
                    formdata.map((a, i) => {
                      {
                        console.log(a);
                      }
                      return (
                        <tr>
                          <th>{i + 1})</th>
                          <th>{a.name}</th>
                          {a && (
                            <th>
                              {a.available}
                              {"\n"}
                              <td>
                                <input
                                  className="w-50"
                                  defaultValue={1}
                                  type="number"
                                  onChange={(w) => {
                                    let a = [...formdata];
                                    let b = a[i];
                                    b.no_of_items = w.target.value;
                                    b.total = b.no_of_items * b.soled_price;
                                    a[i] = b;
                                    this.setState({ formdata: a });
                                    this.total();
                                  }}
                                />
                              </td>

                              {"\n"}
                            </th>
                          )}
                          {a && (
                            <td>
                              <small>
                                ₹{a.min} - ₹{a.max}
                              </small>
                              {"\n"}
                              <td>
                                <input
                                  className="inp"
                                  defaultValue={a.min}
                                  min={a.min}
                                  type="number"
                                  onChange={(w) => {
                                    let a = [...formdata];
                                    let b = a[i];
                                    b.soled_price = w.target.value;
                                    b.total = b.no_of_items * b.soled_price;

                                    a[i] = b;
                                    this.setState({ formdata: a });
                                    this.total();
                                  }}
                                />
                              </td>
                              {"\n"}
                            </td>
                          )}
                          <td>₹{a.total}</td>
                          <td>
                            <button
                              type="button"
                              class="btn-close"
                              aria-label="Close"
                              onClick={() => {
                                this.setState(
                                  {
                                    formdata: [
                                      ...formdata.slice(0, i),
                                      ...formdata.slice(i + 1),
                                    ],
                                  },
                                  () => this.total()
                                );
                                // this.total();
                              }}
                            ></button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
            <input
              className="form-control"
              type="search"
              autoFocus
              name="text"
              value={text}
              placeholder="Search"
              onChange={this.changetext}
            />
            {text &&
              stockdata &&
              stockdata
                .filter((item) => {
                  if (item.name.toLowerCase().includes(text.toLowerCase())) {
                    return item;
                  }
                })
                .map((t, i) => (
                  <table className=" table">
                    <td>
                      <tr
                        onClick={() => {
                          if (this.state.formdata.length === 0) {
                            return this.setState(
                              {
                                searchdata: t,
                                formdata: [
                                  ...this.state.formdata,
                                  {
                                    id: t._id,
                                    name: t.name,
                                    soled_price: t.selling_price_range.min,
                                    actual_price: t.actual_price,
                                    min: t.selling_price_range.min,
                                    max: t.selling_price_range.max,
                                    available: t.available,
                                    no_of_items: 1,
                                    total: t.selling_price_range.min,
                                    soled_by: {
                                      id: User._id,
                                      name: User.name,
                                    },
                                  },
                                ],
                                text: "",
                              },
                              () => this.total()
                            );
                          } else {
                            if (
                              !this.checkAvailability(this.state.formdata, t)
                            ) {
                              return this.setState(
                                {
                                  searchdata: t,
                                  formdata: [
                                    ...this.state.formdata,
                                    {
                                      id: t._id,
                                      name: t.name,
                                      soled_price: t.selling_price_range.min,
                                      actual_price: t.actual_price,
                                      min: t.selling_price_range.min,
                                      max: t.selling_price_range.max,
                                      available: t.available,
                                      no_of_items: 1,
                                      total: t.selling_price_range.min,
                                      soled_by: {
                                        id: User._id,
                                        name: User.name,
                                      },
                                    },
                                  ],
                                  text: "",
                                },
                                () => this.total()
                              );
                            }
                          }
                        }}
                      >
                        <td key={i}>{t.name}</td>
                        {t.available ? (
                          <th key={i + 1}>
                            {t.available} available{"  "}
                            {this.checkAvailability(this.state.formdata, t) ? (
                              <span className="text-success">
                                already added
                              </span>
                            ) : null}
                          </th>
                        ) : (
                          <th className="text-danger" key={i + 1}>
                            not available {"  "}
                            {this.checkAvailability(this.state.formdata, t) ? (
                              <span className="text-success">
                                already added
                              </span>
                            ) : null}
                          </th>
                        )}
                      </tr>
                    </td>
                  </table>
                ))}
            {formdata[0] && (
              <div>
                <table className="table ">
                  <tbody>
                    <tr className="text-end pr-5">
                      <th>
                        <h4>total = ₹{this.state.total}</h4>
                      </th>
                    </tr>
                  </tbody>
                </table>
                <button className="ms-3 ui green button" onClick={this.update}>
                  Bill it
                </button>
              </div>
            )}
          </div>
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
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    return console.log(err);
  }
}
async function Getsale(token) {
  console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
  try {
    const res = await Axios({
      method: "get",
      url: `http://localhost:8000/sale/data`,
      // data: d, // you are sending body instead

      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res);

    return res;
  } catch (err) {
    return console.log(err);
  }
}
async function postbill(x, token) {
  const res = await Axios({
    method: "post",
    url: "http://localhost:8000/bill/create",
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
async function Updatestock(a, x, token) {
  console.log(a);
  const res = await Axios({
    method: "put",
    url: `http://localhost:8000/stock/updateOnSubmit/${a}`,
    // mode: "no-cors",

    data: { no_of_items: x }, // you are sending body instead
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ no_of_items: x }),
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      alert(error);
    });
  console.log(JSON.stringify(res));
  console.log("stock updated");
}

async function Getdaily(token) {
  try {
    const res = await Axios({
      method: "get",
      url: `http://localhost:8000/daily/data`,
      // data: d, // you are sending body instead

      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    return console.log(err);
  }
}
async function Daily(token, i, x) {
  const res = await Axios({
    method: "post",
    url: "http://localhost:8000/daily/create",
    data: { no: 1, investment: i, total: x }, // you are sending body instead
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ no: 1, investment: i, total: x }),
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      alert(error);
    });
  console.log(JSON.stringify(res));
  console.log("submit form");
}
async function updateDaily(e, x, i, token) {
  const res = await Axios({
    method: "put",
    url: `http://localhost:8000/daily/update/${e}`,
    data: { investment: i, total: x }, // you are sending body instead
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ investment: i, total: x }),
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      alert(error);
    });
  console.log(res);
  console.log("sale updated");
}
async function Updatesale(e, x, token) {
  const res = await Axios({
    method: "put",
    url: `http://localhost:8000/sale/updateOnSubmit/${e}`,
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
  console.log("sale updated");
}
async function createsale(x, token) {
  console.log(x);
  const res = await Axios({
    method: "post",
    url: "http://localhost:8000/sale/create",
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
  console.log(JSON.stringify(res));
  console.log("submit form");
}
let findbyid = async (array, data, t) => {
  let b;
  let p = 0;
  let r = 0;
  let R = 0;

  await array.find((sale) => {
    R = (sale.soled_price.profit * data.actual_price * data.no_of_items) / 100;

    let c = {
      number_of_items: data.no_of_items,
      total: data.total,
      revenue: R,
    };
    if (sale.id === data.id && sale.soled_price.price === data.soled_price) {
      b = Updatesale(sale._id, c, t);
    }
  });
  data.soled_price !== data.actual_price
    ? (p = ((data.soled_price - data.actual_price) * 100) / data.actual_price)
    : (p = 0);

  p !== 0 ? (r = (p * data.actual_price * data.no_of_items) / 100) : (r = 0);
  let a = {
    id: data.id,
    name: data.name,
    number_of_items: data.no_of_items,
    actual_price: data.actual_price,
    total: data.total,
    revenue: r,
    soled_price: {
      price: data.soled_price,
      profit: p,
    },
    selling_price_range: {
      min: data.min,
      max: data.max,
    },
    soled_by: {
      id: data.soled_by.id,
      name: data.soled_by.name,
    },
  };
  if (b) return console.log(b);
  else return createsale(a, t);
};
