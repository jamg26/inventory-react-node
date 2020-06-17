import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../routes/routes";
import { Button, Layout, Menu, PageHeader } from "antd";
import { checkAuth } from "../../helper/authCheckAdmin";
import { ArrowRightOutlined } from "@ant-design/icons";
import Side from "../inc/side";
import Header from "../inc/header";
import { withRouter } from "react-router-dom";
import LoadingPage from "../../global-components/loading";
const { Content } = Layout;
function Dashboard(props) {
  const [collaped, setCollaped] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  useEffect(() => {
    checkAuth(props, setShowComponent);
  }, []);
  console.log(useContext(UserContext));
  const toggle = () => {
    setCollaped(!collaped);
  };
  if (showComponent) {
    return [
      <Layout key="1">
        {/* <Side no={props.no} key="1" /> */}
        <Layout style={{ height: "100vh" }}>
          <Header no={props.no} />
          <Content
            style={{
              margin: "0px 0px",
              overflow: "initial",
            }}
          >
            <div className=" dyn-height">
              <PageHeader
                className="site-page-header"
                title="Home"

                // subTitle="This is a subtitle"
              />
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
