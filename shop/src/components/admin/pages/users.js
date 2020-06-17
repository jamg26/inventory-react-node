import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../routes/routes";
import { Button, Layout, Menu, PageHeader } from "antd";
import { ArrowRightOutlined, UserAddOutlined } from "@ant-design/icons";
import Side from "../inc/settingsside";
import Header from "../inc/header";
import { checkAuth } from "../../helper/authCheckAdmin";
import { withRouter } from "react-router-dom";
import Add from "./functions/addStaff";
import Table from "./functions/staffTable";
import LoadingPage from "../../global-components/loading";
const { Content } = Layout;
function Dashboard(props) {
  const [showComponent, setShowComponent] = useState(false);
  useEffect(() => {
    checkAuth(props, setShowComponent);
  }, []);
  const [collaped, setCollaped] = useState(false);
  const toggle = () => {
    setCollaped(!collaped);
  };
  if (showComponent) {
    return [
      <>
        <Layout>
          <Side no={props.no} />
          <Layout style={{ height: "100vh" }}>
            <Header no={props.no} />
            <Content
              style={{
                margin: "0px 0px",
                overflow: "initial",
              }}
            >
              <div className=" dyn-height">
                <PageHeader className="site-page-header" title="Staff" />
                <Table />
              </div>
            </Content>
          </Layout>
        </Layout>
      </>,
    ];
  } else {
    return [<LoadingPage tip="loading page..." />];
  }
}

export default withRouter(Dashboard);
