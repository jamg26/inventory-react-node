import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../routes/routes";
import { Button, Layout, Tabs, PageHeader } from "antd";
import Side from "../inc/side";
import Header from "../inc/header";
import { ArrowRightOutlined } from "@ant-design/icons";
import AccountDetails from "../components/accountDetails";
import AccountCredentials from "../components/accountCredentials";
import { checkAuth } from "../../helper/authCheck";
import { withRouter, Link } from "react-router-dom";
import LoadingPage from "../../global-components/loading";
import axios from "axios";
const { Content } = Layout;
const { TabPane } = Tabs;
function Dashboard(props) {
  const [recheckauth, setrecheckauth] = useState(false);
  const [collaped, setCollaped] = useState(false);
  const [active, setActive] = useState("0");
  const [category, setCategory] = useState("All Products");
  const [showComponent, setShowComponent] = useState(false);
  const [refreshCart, SetRefreshCart] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const toggle = () => {
    setCollaped(!collaped);
  };
  useEffect(() => {
    checkAuth(props, setShowComponent);
  }, [recheckauth]);

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
              <PageHeader className="site-page-header" title={"My Account"} />
              <AccountDetails
                setrecheckauth={() => setrecheckauth(!recheckauth)}
              />
              <PageHeader
                className="site-page-header"
                title={"Password Change"}
              />
              <AccountCredentials />
            </div>
          </Content>
        </Layout>
      </Layout>,
    ];
  } else {
    return [<LoadingPage tip="loading page..." />];
  }
}

export default withRouter(Dashboard);
