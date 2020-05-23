import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../routes/routes";
import { Modal, Layout, Tabs, PageHeader } from "antd";
import Side from "../inc/side";
import Header from "../inc/header";
import { checkAuth } from "../../helper/authCheck";
import SamplePayPal from "../components/SamplePaypal";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../global-components/loading";
const { Content } = Layout;
const { TabPane } = Tabs;
function Orders(props) {
  const [recheckauth, setrecheckauth] = useState(false);
  const [category, setCategory] = useState("All Products");
  const [showComponent, setShowComponent] = useState(false);

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
              <PageHeader
                className="site-page-header"
                title={"Accumulated Points"}
              />
              {/* <SamplePayPal /> */}
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
