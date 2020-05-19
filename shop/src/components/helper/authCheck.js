import axios from "axios";
import { message } from "antd";
import { api_base_url } from "../../keys/index";
export const checkAuth = async (props, setShowComponent, re = false) => {
  const remember_me = localStorage.getItem("landing_remember_account");

  let account = localStorage.getItem("landing_remembered_account");
  if (account === null || account == "") {
    account = undefined;
  }
  console.log("remember_me", remember_me);
  if (remember_me === "true") {
    if (account === undefined) {
      localStorage.setItem("landing_remember_account", false);
      localStorage.setItem("landing_remembered_account", "");
      localStorage.setItem("landing_credentials", "");
      localStorage.setItem("landing_customer_id", "");
      localStorage.setItem("landing_customer_login_token", "");
      props.history.push("/login");
    } else {
      const data = JSON.parse(account);
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        api_base_url + "/check_auth",
        { _id: data._id, login_token: data.login_token },
        { headers: headers }
      );
      if (response.data.status === "OK") {
        localStorage.setItem(
          "landing_remembered_account",
          JSON.stringify(response.data.data)
        );
        localStorage.setItem(
          "landing_credentials",
          JSON.stringify(response.data.data)
        );
        localStorage.setItem("landing_customer_id", response.data.data._id);
        localStorage.setItem(
          "landing_customer_login_token",
          response.data.data.login_token
        );
        console.log("authenticated");
        if (re) {
          props.history.push("/");
        }
      } else {
        localStorage.setItem("landing_remember_account", false);
        localStorage.setItem("landing_remembered_account", "");
        localStorage.setItem("landing_credentials", "");
        localStorage.setItem("landing_customer_id", "");
        localStorage.setItem("landing_customer_login_token", "");
        props.history.push("/login");
      }
    }
  } else {
    localStorage.setItem("landing_remember_account", false);
    localStorage.setItem("landing_remembered_account", "");
    localStorage.setItem("landing_credentials", "");
    localStorage.setItem("landing_customer_id", "");
    localStorage.setItem("landing_customer_login_token", "");
    props.history.push("/login");
  }
  setShowComponent(true);
};
