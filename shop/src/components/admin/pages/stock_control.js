import React, { useEffect, useState } from "react";
import { UserContext } from "../../../routes/routes";
import { Button, Layout, Menu, PageHeader, Tabs } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Side from "../inc/side";
import Header from "../inc/header";
import { checkAuth } from "../../helper/authCheckAdmin";
import NewPurchaseOrder from "../stock_control_ui/newPurchaseOrder";
import ActiveTransactions from "../stock_control_ui/activeTransactions";
import StockTransfer from "../stock_control_ui/stockTransfer";
import ReturnStock from "../stock_control_ui/returnStock";
import { withRouter } from "react-router-dom";
import { api_base_url, api_base_url_orders } from "../../../keys/index";
import axios from "axios";
import LoadingPage from "../../global-components/loading";
const { Content } = Layout;
const { TabPane } = Tabs;

function Dashboard(props) {
  const [refreshPOList, setrefreshPOList] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [products, setProducts] = useState([]);
  const [SupplierList, setSupplierList] = useState([]);
  const get_products = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/products",
      {},
      { headers: headers }
    );
    setProducts(response.data);
  };
  const get_suppliers = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/supplier_list",
      {},
      { headers: headers }
    );
    setSupplierList(response.data);
  };
  useEffect(() => {
    checkAuth(props, setShowComponent);
    get_products();
    get_suppliers();
  }, []);
  if (showComponent) {
    return [
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
                title="Stock Control"
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
              <div className="pages-container">
                <Tabs defaultActiveKey="activeTransaction" type="card">
                  <TabPane tab="Active Transactions" key="activeTransaction">
                    <div>
                      <ActiveTransactions refresh_trigger={refreshPOList} />
                    </div>
                  </TabPane>
                  <TabPane tab="New Purchase Order" key="newPurchaseOrder">
                    <div>
                      <NewPurchaseOrder
                        refresh={() => {
                          setrefreshPOList(!refreshPOList);
                        }}
                        SupplierList={SupplierList}
                        products={products}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab="Stock Transfer" key="stockTransfer">
                    <StockTransfer
                      refresh={() => {
                        setrefreshPOList(!refreshPOList);
                      }}
                      SupplierList={SupplierList}
                      products={products}
                    />
                  </TabPane>
                  <TabPane tab="Return Stock" key="returnStock">
                    <ReturnStock
                      refresh={() => {
                        setrefreshPOList(!refreshPOList);
                      }}
                      SupplierList={SupplierList}
                      products={products}
                    />
                  </TabPane>
                  {/* <TabPane tab="Stock Adjustment" key="stockAdjustment">
                    Content of Tab Pane Stock Adjustment
                  </TabPane>
                  <TabPane tab="Inventory Count" key="inventoryCount">
                    Content of Tab Pane Inventory Count
                  </TabPane> */}
                </Tabs>
              </div>
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
