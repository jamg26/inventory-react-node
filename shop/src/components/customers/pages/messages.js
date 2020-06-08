import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../routes/routes";
import { Modal, Layout, Tabs, PageHeader, Card } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Side from "../inc/side";
import Header from "../inc/header";
import { checkAuth } from "../../helper/authCheck";
import SamplePayPal from "../components/SamplePaypal";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../global-components/loading";
import EmailComponent from "../components/messages/email_component";
import Chatting from "../../customer_messaging/MessagingComponent";
import {
  ContainerOutlined,
  WechatOutlined,
  ShoppingCartOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { SettingContext } from "../../../routes/routes";
const { Content } = Layout;
const { TabPane } = Tabs;
function Orders(props) {
  const [userdata, setuserdata] = useState(undefined);
  const setting_configuration = useContext(SettingContext);
  const [recheckauth, setrecheckauth] = useState(false);
  const [category, setCategory] = useState("All Products");
  const [showComponent, setShowComponent] = useState(false);
  useEffect(() => {
    checkAuth(props, setShowComponent);
  }, [recheckauth]);
  useEffect(() => {
    let account = localStorage.getItem("landing_remembered_account");
    if (account === null || account == "") {
      account = undefined;
    }
    if (account === undefined) {
    } else {
      const data = JSON.parse(account);

      setuserdata(data);
    }
  }, []);
  if (showComponent) {
    return [
      <Layout>
        <Side setCategory={setCategory} no={props.no} />
        <Layout style={{ height: "100vh" }}>
          <Header />
          <Content
            style={{
              margin: "24px 16px 24px 16px",
              overflow: "initial",
            }}
          >
            <div className=" dyn-height">
              <Card bodyStyle={{ padding: 0 }}>
                <Chatting
                  name={userdata ? userdata.fname : ""}
                  room={userdata ? userdata._id : ""}
                  id={userdata ? userdata._id : ""}
                />
              </Card>
            </div>
          </Content>
        </Layout>
      </Layout>,
    ];
  } else {
    return [<LoadingPage tip="loading page..." />];
  }
}

export default withRouter(Orders);
