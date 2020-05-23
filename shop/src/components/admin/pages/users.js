import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../routes/routes";
import { Button, Layout, Menu, PageHeader } from "antd";
import { ArrowRightOutlined, UserAddOutlined } from "@ant-design/icons";
import Side from "../inc/side";
import Header from "../inc/header";
import { checkAuth } from "../../helper/authCheckAdmin";
import { withRouter } from "react-router-dom";
import Add from "./functions/addStaff";
import Table from "./functions/staffTable";

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

  return [
    <>
      <Layout>
        <Side no={props.no} />
        <Layout style={{ height: "100vh" }}>
          <Header />
          <Content
            style={{
              margin: "24px 16px 24px 16px",
              overflow: "initial",
              backgroundColor: "white",
            }}
          >
            <div className="site-layout-background dyn-height">
              <PageHeader
                className="site-page-header"
                title="Staff"
                onBack={() => props.history.goBack()}
                extra={[
                  <Button
                    onClick={() => {
                      props.history.go(+1);
                    }}
                    type="link"
                    className="ant-page-header-back-button"
                    style={{ fontSize: "16px" }}
                  >
                    <ArrowRightOutlined />
                  </Button>,
                  ,
                ]}
                // subTitle="This is a subtitle"
              />
              <Table />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>,
  ];
}

export default withRouter(Dashboard);
