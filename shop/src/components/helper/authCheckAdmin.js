import axios from "axios";
import { message } from "antd";
import { api_base_url } from "../../keys/index";
export const checkAuth = async (props, setShowComponent, re = false) => {
  const remember_me = localStorage.getItem("remember_account");

  let account = localStorage.getItem("remembered_account");
  if (account === null || account == "") {
    account = undefined;
  }

  if (remember_me === "true") {
    if (account === undefined) {
      localStorage.setItem("remember_account", false);
      localStorage.setItem("remembered_account", "");
      localStorage.setItem("credentials", "");
      localStorage.setItem("webadmin_id", "");
      localStorage.setItem("webadmin_login_token", "");
      props.history.push("/web-admin");
    } else {
      const data = JSON.parse(account);
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        api_base_url + "/user/check_auth",
        { _id: data._id, login_token: data.login_token },
        { headers: headers }
      );
      if (response.data.status === "OK") {
        localStorage.setItem(
          "remembered_account",
          JSON.stringify(response.data.data)
        );
        localStorage.setItem("credentials", JSON.stringify(response.data.data));
        localStorage.setItem("webadmin_id", response.data.data._id);
        localStorage.setItem(
          "webadmin_login_token",
          response.data.data.login_token
        );
        console.log("authenticated");
        if (re) {
          props.history.push("/web-admin/home");
        }
      } else {
        localStorage.setItem("remember_account", false);
        localStorage.setItem("remembered_account", "");
        localStorage.setItem("credentials", "");
        localStorage.setItem("webadmin_id", "");
        localStorage.setItem("webadmin_login_token", "");
        props.history.push("/web-admin");
      }
    }
  } else {
    localStorage.setItem("remember_account", false);
    localStorage.setItem("remembered_account", "");
    localStorage.setItem("credentials", "");
    localStorage.setItem("webadmin_id", "");
    localStorage.setItem("webadmin_login_token", "");
    props.history.push("/web-admin");
  }
  setShowComponent(true);
};
