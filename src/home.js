import React from "react";
import { Link, Navigate } from "react-router-dom";
import IsAuthenticated from "./user/isAuthenticated";

function Home() {
  if (IsAuthenticated()) {
    const { User } = IsAuthenticated();
    if (!User.isadmin) {
      return <Navigate to="/worker" />;
    } else return <Navigate to="/workspace" />;
  } else {
    return (
      <div className="text-center">
        <div className="mt-5">
          <Link className="text-reset pt-4 text-decoration-none" to="/signin">
            <h4 style={{ color: "#D2691E" }}>
              <strong>
                శ్రీరామ రామ రామేతి , రమే రామే మనోరమే; సహస్ర నామ తతుల్యం, రామ నామ
                వరాననే.
              </strong>
            </h4>
          </Link>
        </div>
        <img src={require("./rama.jpg")} alt="శ్రీరామ" />
        <div className="mt-4">
          <h1>Kushal Ettey Shop</h1>
          <p>Automobile and electical shop</p>
          <p>contack number 123456790</p>
          <p>email Ettey@gmail.com</p>
          <p>timings 6 A.M to 9 P.M</p>
        </div>
        {/* <img src={require("/rama.jpg")} alt="శ్రీరామ" /> */}
      </div>
    );
  }
}

export default Home;
