function IsAuthenticated() {
  if (typeof window == "undefined") return false;
  else if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else return false;
}

export default IsAuthenticated;
