import React, { useEffect, useState } from "react";
import { UserContext } from "../../../routes/routes";
import {
  Button,
  Layout,
  PageHeader,
  Empty,
  Table,
  Drawer,
  Tabs,
  Card,
  Typography,
  Collapse,
  Checkbox,
} from "antd";
import { ArrowRightOutlined, FastForwardOutlined } from "@ant-design/icons";
import { checkAuth } from "../../helper/authCheckAdmin";
import Side from "../inc/side";
import Header from "../inc/header";
import { withRouter } from "react-router-dom";
const { Content } = Layout;
const { TabPane } = Tabs;

function Dashboard(props) {
  const [showComponent, setShowComponent] = useState(false);
  useEffect(() => {
    checkAuth(props, setShowComponent);
  }, []);
  console.log(props);
  const [collaped, setCollaped] = useState(false);
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
                title="Inventory"
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
              <Tabs
                defaultActiveKey="1"
                tabBarStyle={{ paddingLeft: "20px", paddingRight: "20px" }}
                type="card"
              >
                <TabPane tab="Tab 1" key="1">
                  Content of Tab Pane 1
                </TabPane>
                <TabPane tab="Tab 2" key="2">
                  Content of Tab Pane 2
                </TabPane>
                <TabPane tab="Tab 3" key="3">
                  Content of Tab Pane 3
                </TabPane>
              </Tabs>
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
