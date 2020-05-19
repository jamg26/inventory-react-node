import React, { useEffect, useState } from "react";
import { UserContext } from "../../../routes/routes";
import { Button, Layout, Menu, PageHeader } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { checkAuth } from "../../helper/authCheckAdmin";
import Side from "../inc/side";
import Header from "../inc/header";
import { withRouter } from "react-router-dom";
const { Content } = Layout;
function Dashboard(props) {
  const [collaped, setCollaped] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  useEffect(() => {
    checkAuth(props, setShowComponent);
  }, []);
  // console.log(useContext(UserContext));
  const toggle = () => {
    setCollaped(!collaped);
  };
  if (showComponent) {
    return [
      <Layout key="0">
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
                title="Analytics"
                onBack={() => props.history.goBack()}
                extra={[
                  <Button
                    key="0"
                    onClick={() => {
                      console.log(props.history);
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
            </div>
          </Content>
        </Layout>
      </Layout>,
    ];
  } else {
    return null;
  }
}

export default withRouter(Dashboard);
