import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../routes/routes";
import {
  Button,
  Layout,
  Menu,
  PageHeader,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Modal,
} from "antd";
import { checkAuth } from "../../helper/authCheckAdmin";
import { ArrowRightOutlined, RightOutlined } from "@ant-design/icons";
import Side from "../inc/side";
import Header from "../inc/header";
import { withRouter } from "react-router-dom";
import LoadingPage from "../../global-components/loading";
import ActiveTransactions from "../stock_control_ui/activeTransactions";
import AbandonedCart from "../components/orders/abandoned_cart";
const { Content } = Layout;
const { Title, Text, Link } = Typography;
const ReportList = [
  "",
  "Product Purchase",
  "Inventory Stock on Hand",
  "Reorder",
  "Incoming Stock",
  "Purchase Order History",
  "Receive History",
  "Bill Details",
  "Payment Made",
  "Sales Order History",
  "Invoice History",
  "Sales by Product",
  "Sales by Period",
  "Cancelled Orders",
  "Abandoned Carts",
  "Refunds",
  "Returned",
  "Purchase by Vendor",
];
function Dashboard(props) {
  const [collaped, setCollaped] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [showReport, setshowReport] = useState(false);
  const [selected_report, set_selected_report] = useState(0);
  useEffect(() => {
    checkAuth(props, setShowComponent);
  }, []);
  useEffect(() => {
    console.log("selected_report", selected_report);
    if (selected_report != 0) {
      setshowReport(true);
    } else {
      setshowReport(false);
    }
  }, [selected_report]);
  console.log(useContext(UserContext));
  const toggle = () => {
    setCollaped(!collaped);
  };
  const renderSwitch = (param) => {
    switch (param) {
      case 1:
        return (
          <ActiveTransactions
            refresh_trigger={() => {}}
            searchword="Purchase Order"
            filterfromprops="Open"
          />
        );
      case 2:
        return null;
      case 3:
        return null;
      case 4:
        return null;
      case 5:
        return <ActiveTransactions refresh_trigger={() => {}} />;
      case 6:
        return null;
      case 7:
        return null;
      case 8:
        return null;
      case 9:
        return null;
      case 10:
        return null;
      case 11:
        return null;
      case 12:
        return null;
      case 13:
        return null;
      case 14:
        return <AbandonedCart setCustomer={() => {}} report={true} />;
      case 15:
        return null;
      case 16:
        return null;
      case 17:
        return null;
      default:
        return null;
    }
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
            <Modal
              title={ReportList[selected_report]}
              onCancel={() => set_selected_report(0)}
              visible={showReport}
              style={{ top: 20 }}
              bodyStyle={{ minHeight: "80vh" }}
              footer={[
                <Button key="back" onClick={() => set_selected_report(0)}>
                  Return
                </Button>,
              ]}
              width="98%"
            >
              {renderSwitch(selected_report)}
            </Modal>
            <div className=" dyn-height">
              <PageHeader
                className="site-page-header"
                title="Reports"
                onBack={() => props.history.goBack()}
                extra={[
                  <Button
                    key="0"
                    onClick={() => {
                      props.history.go(+1);
                    }}
                    type="link"
                    className="ant-page-header-back-button"
                    style={{ fontSize: "16px" }}
                  >
                    <ArrowRightOutlined />
                  </Button>,
                ]}
              />
              <Card
                style={{
                  borderBottom: "1px solid #ccc",
                  borderRight: "1px solid #ccc",
                }}
              >
                <Row gutter={[30, 16]}>
                  <Col span="8">
                    <Space
                      direction="vertical"
                      size={12}
                      style={{ width: "100%", marginBottom: 20 }}
                    >
                      <Text strong>Stocks</Text>
                      <Space direction="vertical" size={0}>
                        <Link
                          className={`ActiveReportLinks ${
                            selected_report == 1 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            set_selected_report(1);
                          }}
                          key={1}
                        >
                          <RightOutlined />
                          Product Purchase
                        </Link>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 2 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(2);
                          }}
                          key={2}
                        >
                          <RightOutlined />
                          Inventory Stock on Hand
                        </Link>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 3 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(3);
                          }}
                          key={3}
                        >
                          <RightOutlined />
                          Reorder
                        </Link>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 4 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(4);
                          }}
                          key={4}
                        >
                          <RightOutlined />
                          Incoming Stocks
                        </Link>
                      </Space>
                    </Space>
                    <Space
                      direction="vertical"
                      size={12}
                      style={{ width: "100%" }}
                    >
                      <Text strong>Purchases</Text>
                      <Space direction="vertical" size={0}>
                        <Link
                          className={`ActiveReportLinks ${
                            selected_report == 5 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            set_selected_report(5);
                          }}
                          key={5}
                        >
                          <RightOutlined />
                          Purchase Order History
                        </Link>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 6 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(6);
                          }}
                          key={6}
                        >
                          <RightOutlined />
                          Receive History
                        </Link>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 17 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(7);
                          }}
                          key={17}
                        >
                          <RightOutlined />
                          Purchase by Vendor
                        </Link>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 7 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(7);
                          }}
                          key={7}
                        >
                          <RightOutlined />
                          Bill Details
                        </Link>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 8 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(8);
                          }}
                          key={8}
                        >
                          <RightOutlined />
                          Payment Made
                        </Link>
                      </Space>
                    </Space>
                  </Col>
                  <Col span="8">
                    <Space
                      direction="vertical"
                      size={12}
                      style={{ width: "100%" }}
                    >
                      <Text strong>Sales</Text>
                      <Space direction="vertical" size={0}>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 9 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(9);
                          }}
                          key={9}
                        >
                          <RightOutlined />
                          Sales Order History
                        </Link>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 10 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(10);
                          }}
                          key={10}
                        >
                          <RightOutlined />
                          Invoice History
                        </Link>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 11 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(11);
                          }}
                          key={11}
                        >
                          <RightOutlined />
                          Sales By Product
                        </Link>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 12 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(12);
                          }}
                          key={12}
                        >
                          <RightOutlined />
                          Sales By Period
                        </Link>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 13 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(13);
                          }}
                          key={13}
                        >
                          <RightOutlined />
                          Cancelled Orders
                        </Link>
                        <Link
                          className={`ActiveReportLinks ${
                            selected_report == 14 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            set_selected_report(14);
                          }}
                          key={14}
                        >
                          <RightOutlined />
                          Abandoned Carts
                        </Link>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 15 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(15);
                          }}
                          key={15}
                        >
                          <RightOutlined />
                          Refunds
                        </Link>
                        <Link
                          className={`ReportLinks ${
                            selected_report == 16 ? "activereport" : ""
                          }`}
                          onClick={() => {
                            //set_selected_report(16);
                          }}
                          key={16}
                        >
                          <RightOutlined />
                          Returns
                        </Link>
                      </Space>
                    </Space>
                  </Col>
                  <Col span="8"></Col>
                </Row>
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

export default withRouter(Dashboard);
