import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../routes/routes";
import { Modal, Layout, Tabs, PageHeader, Card } from "antd";
import Side from "../inc/side";
import Header from "../inc/header";
import { checkAuth } from "../../helper/authCheck";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../global-components/loading";
import Chatting from "../../messaging/MessagingComponent";
import {
  ContainerOutlined,
  WechatOutlined,
  ShoppingCartOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { SettingContext } from "../../../routes/routes";
import Mail from "../components/Mail/Mail";
const { Content } = Layout;
const { TabPane } = Tabs;
function Orders(props) {
  const [userdata, setuserdata] = useState(undefined);
  const [accountdata, setaccountdata] = useState({});
  const setting_configuration = useContext(SettingContext);
  const [recheckauth, setrecheckauth] = useState(false);
  const [category, setCategory] = useState("All Products");
  const [showComponent, setShowComponent] = useState(false);
  useEffect(() => {
    let account = localStorage.getItem("remembered_account");
    if (account === null || account == "") {
      account = undefined;
    }
    if (account === undefined) {
    } else {
      const data = JSON.parse(account);
      setaccountdata(data);
    }
  }, []);
  useEffect(() => {
    checkAuth(props, setShowComponent);
  }, []);
  if (showComponent) {
    return [
      <Layout>
        {/* <Side setCategory={setCategory} no={props.no} /> */}
        <Layout style={{ height: "100vh" }}>
          <Header no={props.no} />
          <Content
            style={{
              overflow: "initial",
            }}
          >
            <div className=" dyn-height-no-padding">
              <Tabs
                defaultActiveKey="1"
                type="card"
                tabBarStyle={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                <TabPane
                  tab={
                    <span>
                      <ContainerOutlined />
                      Email
                    </span>
                  }
                  key="1"
                >
                  <Card style={{ height: "100%" }} bodyStyle={{ padding: 0 }}>
                    <Mail
                      system_settings={
                        setting_configuration
                          ? setting_configuration
                          : undefined
                      }
                      shop_email={
                        setting_configuration
                          ? setting_configuration.sender_email
                          : undefined
                      }
                    />
                  </Card>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <WechatOutlined />
                      Chat
                    </span>
                  }
                  key="2"
                >
                  <Card bodyStyle={{ padding: 0, border: "1px solid #e9e9e9" }}>
                    <Chatting
                      name={accountdata ? accountdata.name : ""}
                      room={accountdata ? accountdata._id : ""}
                      id={accountdata ? accountdata._id : ""}
                    />
                  </Card>
                </TabPane>
              </Tabs>
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
