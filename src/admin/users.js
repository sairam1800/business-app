import { Component } from "react/cjs/react.production.min";
import Axios from "axios";
import Head from "../head";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
import IsAuthenticated from "../user/isAuthenticated";

export class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      name: "",
      email: "",
      password: "",
      isadmin: false,
      users: [],
      token: "",
      User: {},
      showForm: false,
    };
    this.getusers = this.getusers.bind(this);
  }
  getusers = async () => {
    let n = await Getusers(this.state.token);
    let total = n.data.length;
    return this.setState({ users: n.data, total });
  };
  // createuser()
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
          <div>
            <label> Name : </label>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => this.setState({ name: e.target.value })}
            />
          </div>
          <div>
            <label> Email : </label>
            <input
              type="text"
              placeholder="Email"
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </div>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              onChange={() => this.setState({ isadmin: !this.state.isadmin })}
            />
            <label class="form-check-label" for="flexSwitchCheckDefault">
              Admin
            </label>
          </div>

          <label> Password : </label>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => this.setState({ password: e.target.value })}
          />
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

  onSubmitForm = async () => {
    let a = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      isadmin: this.state.isadmin,
    };
    await createuser(a, this.state.token);
    this.setState(
      {
        name: "",
        email: "",
        password: "",
        isadmin: false,
        showForm: false,
      },
      () => this.getusers()
    );
  };

  deleteuser = async (a, n) => {
    confirmAlert({
      title: <h3 className="text-danger ">Warning</h3>,
      message: `Are you sure ${this.state.User.name}? Do you want to delete ${n}?`,
      buttons: [
        {
          label: <strong className="text-danger ">Delete</strong>,
          onClick: async () => {
            await Deleteuser(a);
            await this.getusers();
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

      this.setState({ token, User }, () => this.getusers());
    }
  }
  render() {
    return (
      <>
        <header>{Head()}</header>
        <p>total : {this.state.total}</p>
        <p>{this.state.User.isadmin}</p>
        <button
          className="btn"
          onClick={() => this.setState({ showForm: true })}
        >
          create new user
        </button>
        {this.state.showForm && this.showForm()}
        {this.state.users &&
          this.state.users.map((a, i) => (
            <section key={i + 9999}>
              {a.isadmin ? (
                <div>
                  <p>
                    {i + 1}) {a.name} is
                    <p className="text-primary ">
                      Admin
                      <button onClick={() => this.deleteuser(a._id, a.name)}>
                        delete
                      </button>
                    </p>
                  </p>
                </div>
              ) : (
                <p>
                  {" "}
                  {i + 1}) {a.name} is worker
                  <button onClick={() => this.deleteuser(a._id, a.name)}>
                    delete
                  </button>
                </p>
              )}
            </section>
          ))}
      </>
    );
  }
}
async function Getusers(token) {
  try {
    const res = await Axios({
      method: "get",
      url: `http://localhost:8000/user/data`,
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
async function createuser(x, token) {
  const res = await Axios({
    method: "post",
    url: "http://localhost:8000/user/signup",
    data: x,
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
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
async function Deleteuser(x, token) {
  try {
    const res = await Axios({
      method: "get",
      url: `http://localhost:8000/user/delete/${x}`,
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
