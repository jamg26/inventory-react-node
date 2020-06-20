import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../routes/routes";
import {
  Button,
  Layout,
  Row,
  Col,
  Typography,
  PageHeader,
  Statistic,
  Card,
  Divider,
  Upload,
  message,
  Input,
  Space,
  Select,
} from "antd";
import {
  ArrowRightOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  LoadingOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { api_base_url_settings } from "../../../keys/index";
import axios from "axios";
import { checkAuth } from "../../helper/authCheckAdmin";
import Side from "../inc/settingsside";
import Header from "../inc/header";
import {
  SettingContext,
  SettingContextRefresher,
} from "../../../routes/routes";
import { withRouter } from "react-router-dom";
import LoadingPage from "../../global-components/loading";
import UserCount from "./analytics-cards/user_count_card";
import AbandonedCarts from "./analytics-cards/abandoned_cart";
import LowStocks from "./analytics-cards/product_on_low_stock";
import NoStocks from "./analytics-cards/product_on_no_stock";
import ActivePO from "./analytics-cards/active_po";
import DuePO from "./analytics-cards/due_po";
import { api_base_url_orders } from "../../../keys/index";
const { Option } = Select;
const { Content } = Layout;
const { Text, Paragraph, Link } = Typography;
function Dashboard(props) {
  const setting_configuration = useContext(SettingContext);
  const setting_configuration_refresher = useContext(SettingContextRefresher);
  const [showComponent, setShowComponent] = useState(false);
  const [loading, setloading] = useState(false);

  const [setting_id, set_setting_id] = useState(undefined);
  const [imageUrl, setimageUrl] = useState(undefined);
  const [imageUrl2, setimageUrl2] = useState(undefined);
  const [org_name, set_org_name] = useState("");
  const [org_industry, set_org_industry] = useState("");
  const [org_business_type, set_org_business_type] = useState("");
  const [org_business_location, set_org_business_location] = useState(
    "Philippines"
  );
  const [aws_region, set_aws_region] = useState("");
  const [aws_access_key_id, set_aws_access_key_id] = useState("");
  const [aws_secret_key, set_aws_secret_key] = useState("");
  const [g_account_password, set_g_account_password] = useState("");

  const [fb_app_id, set_fb_app_id] = useState("");
  const [fb_page_id, set_fb_page_id] = useState("");
  const [org_street_one, set_org_street_one] = useState("");
  const [org_street_two, set_org_street_two] = useState("");
  const [org_city, set_org_city] = useState("");
  const [org_province, set_org_province] = useState("");
  const [org_zip_code, set_org_zip_code] = useState("");
  const [org_phone, set_org_phone] = useState("");
  const [org_fax, set_org_fax] = useState("");
  const [org_website, set_org_website] = useState("");
  const [org_sender_email, set_org_sender_email] = useState("");
  const [paypal_client_id, set_paypal_client_id] = useState("");
  const [google_api_key, set_google_api_key] = useState("");

  const [org_send_through, set_org_send_through] = useState("");
  const [org_base_currency, set_org_base_currency] = useState("PHP");
  const [org_date_format, set_org_date_format] = useState("MM-DD-YYYY");
  const [submit_loading, set_submit_loading] = useState(false);
  const [validemail1, setvalidemail1] = useState(true);
  const [validemail2, setvalidemail2] = useState(true);
  useEffect(() => {
    if (setting_configuration) {
      set_setting_id(setting_configuration._id);
      setimageUrl(setting_configuration.logo);
      setimageUrl2(setting_configuration.banner);
      set_org_name(setting_configuration.name);
      set_org_industry(setting_configuration.industry);
      set_org_business_type(setting_configuration.type);
      set_org_business_location(setting_configuration.location);
      set_org_street_one(setting_configuration.streetone);
      set_org_street_two(setting_configuration.streettwo);
      set_org_city(setting_configuration.city);
      set_org_province(setting_configuration.province);
      set_org_zip_code(setting_configuration.zipcode);
      set_org_phone(setting_configuration.phone);
      set_org_fax(setting_configuration.fax);
      set_org_website(setting_configuration.website);
      set_org_sender_email(setting_configuration.sender_email);
      set_org_send_through(setting_configuration.send_through_email);
      set_org_base_currency(setting_configuration.base_currency);
      set_org_date_format(setting_configuration.date_format);

      set_aws_region(setting_configuration.aws_region);
      set_aws_access_key_id(setting_configuration.aws_access_key_id);
      set_aws_secret_key(setting_configuration.aws_secret_key);
      set_g_account_password(setting_configuration.g_account_password);
      set_fb_app_id(setting_configuration.fb_app_id);
      set_fb_page_id(setting_configuration.fb_page_id);
      set_paypal_client_id(setting_configuration.paypal_client_id);
      set_google_api_key(setting_configuration.google_api_key);
    }
  }, [setting_configuration]);
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setloading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setloading(false);
        setimageUrl(imageUrl);
        save_image(imageUrl);
        // setTimeout(() => {
        //   onSuccess("ok");
        // }, 0);
      });
    }
  };
  const beforeUpload2 = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange2 = (info) => {
    if (info.file.status === "uploading") {
      setloading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setloading(false);
        setimageUrl2(imageUrl);
        save_image2(imageUrl);
        // setTimeout(() => {
        //   onSuccess("ok");
        // }, 0);
      });
    }
  };
  const save_image2 = async (imageUrl) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      api_base_url_orders + "/upload",
      { imageUrl: imageUrl2 },
      { headers: headers }
    );
  };
  const save_image = async (imageUrl) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      api_base_url_orders + "/upload",
      { imageUrl: imageUrl },
      { headers: headers }
    );
  };
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  useEffect(() => {
    checkAuth(props, setShowComponent);
  }, []);
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const submit_org_settings = async () => {
    set_submit_loading(true);
    console.log(setting_id);
    let valid_sender_email = true;
    if (org_sender_email != "") {
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(org_sender_email)
      ) {
      } else {
        valid_sender_email = false;
      }
    }
    let valid_sent_email = true;
    if (org_send_through != "") {
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(org_send_through)
      ) {
      } else {
        valid_sent_email = false;
      }
    }
    if (valid_sender_email && valid_sent_email) {
      setvalidemail1(valid_sender_email);
      setvalidemail2(valid_sent_email);
      if (org_name == "") {
        set_submit_loading(false);
        message.error("Organization Name cannot be blank");
      } else {
        if (org_business_location == "") {
          message.error("Business Location cannot be blank");
          set_submit_loading(false);
        } else {
          let webadmin_login_token = localStorage.getItem(
            "webadmin_login_token"
          );
          const headers = {
            "Content-Type": "application/json",
          };
          const response = await axios
            .post(
              api_base_url_settings + "/update_settings",
              {
                login_token: webadmin_login_token,
                setting_id,
                imageUrl,
                imageUrl2,
                org_name,
                org_industry,
                org_business_type,
                org_business_location,
                org_street_one,
                org_street_two,
                org_city,
                org_province,
                org_zip_code,
                org_phone,
                org_fax,
                org_website,
                org_sender_email,
                org_send_through,
                org_base_currency,
                org_date_format,
                aws_region,
                aws_access_key_id,
                aws_secret_key,
                g_account_password,
                fb_app_id,
                fb_page_id,
                paypal_client_id,
                google_api_key,
              },
              { headers: headers }
            )
            .then((response) => {
              message.success(response.data.message);
              setting_configuration_refresher();
              set_submit_loading(false);
            })
            .catch((err) => {
              message.error(err.response.data.message);
              set_submit_loading(false);
            });
        }
      }
    } else {
      set_submit_loading(false);
      if (valid_sender_email == false) {
        setvalidemail1(valid_sender_email);
        message.error("Sender Email Invalid");
      }
      if (valid_sent_email == false) {
        setvalidemail2(valid_sent_email);
        message.error("Receiver Email Invalid");
      }
    }
  };
  if (showComponent) {
    return [
      <Layout key="0">
        <Side no={props.no} />
        <Layout style={{ height: "100vh" }}>
          <Header no={props.no} />
          <Content
            style={{
              margin: "24px 16px 24px 16px",
              overflow: "initial",
              backgroundColor: "white",
              borderBottom: "1px solid rgba(0,0,0,0.2)",
              borderRight: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <div className="site-layout-background dyn-height">
              <h1>Organization Profile</h1>
              <Divider />
              <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong>Your Logo</Text>
                </Col>
                <Col span="8">
                  <Space>
                    <Upload
                      style={{ width: "100%" }}
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      customRequest={dummyRequest}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="avatar"
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <div>
                          {loading ? <LoadingOutlined /> : <PlusOutlined />}
                          <div className="ant-upload-text">Upload</div>
                        </div>
                      )}
                    </Upload>
                    {imageUrl ? (
                      <Button
                        size="small"
                        onClick={() => setimageUrl(undefined)}
                        type="link"
                      >
                        <CloseCircleOutlined />
                      </Button>
                    ) : null}
                  </Space>
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong>Shop Banner</Text>
                </Col>
                <Col span="8">
                  <Space>
                    <Upload
                      style={{ width: "100%" }}
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      customRequest={dummyRequest}
                      beforeUpload={beforeUpload2}
                      onChange={handleChange2}
                    >
                      {imageUrl2 ? (
                        <img
                          src={imageUrl2}
                          alt="avatar"
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <div>
                          {loading ? <LoadingOutlined /> : <PlusOutlined />}
                          <div className="ant-upload-text">Upload</div>
                        </div>
                      )}
                    </Upload>
                    {imageUrl2 ? (
                      <Button
                        size="small"
                        onClick={() => setimageUrl(undefined)}
                        type="link"
                      >
                        <CloseCircleOutlined />
                      </Button>
                    ) : null}
                  </Space>
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong style={{ color: "red" }}>
                    Organization Name*
                  </Text>
                </Col>
                <Col span="9">
                  <Input
                    placeholder="organization name"
                    value={org_name}
                    onChange={(event) => set_org_name(event.target.value)}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong>Industry</Text>
                </Col>
                <Col span="9">
                  <Input
                    placeholder="industry"
                    value={org_industry}
                    onChange={(event) => set_org_industry(event.target.value)}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong>Business Type</Text>
                </Col>
                <Col span="9">
                  <Input
                    placeholder="business type"
                    value={org_business_type}
                    onChange={(event) =>
                      set_org_business_type(event.target.value)
                    }
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong style={{ color: "red" }}>
                    Business Location*
                  </Text>
                </Col>
                <Col span="9">
                  <Input
                    placeholder="business location"
                    value={org_business_location}
                    onChange={(event) =>
                      set_org_business_location(event.target.value)
                    }
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong>Company Address</Text>
                </Col>
                <Col span="18">
                  <Input
                    placeholder="street 1"
                    value={org_street_one}
                    onChange={(event) => set_org_street_one(event.target.value)}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong></Text>
                </Col>
                <Col span="18">
                  <Input
                    placeholder="street 2"
                    value={org_street_two}
                    onChange={(event) => set_org_street_two(event.target.value)}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong></Text>
                </Col>
                <Col span="6">
                  <Input
                    placeholder="city"
                    value={org_city}
                    onChange={(event) => set_org_city(event.target.value)}
                  />
                </Col>
                <Col span="6">
                  <Input
                    placeholder="province"
                    value={org_province}
                    onChange={(event) => set_org_province(event.target.value)}
                  />
                </Col>
                <Col span="6">
                  <Input
                    placeholder="zip/postal code"
                    value={org_zip_code}
                    onChange={(event) => set_org_zip_code(event.target.value)}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 24]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong></Text>
                </Col>
                <Col span="6">
                  <Input
                    placeholder="phone"
                    value={org_phone}
                    onChange={(event) => set_org_phone(event.target.value)}
                  />
                </Col>
                <Col span="6">
                  <Input
                    placeholder="fax"
                    value={org_fax}
                    onChange={(event) => set_org_fax(event.target.value)}
                  />
                </Col>
                <Col span="6">
                  <Input
                    placeholder="website"
                    value={org_website}
                    onChange={(event) => set_org_website(event.target.value)}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong>Primary Contact</Text>
                </Col>
                <Col span="6">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Text type="secondary">SENDER</Text>
                    <Paragraph
                      className={`${
                        validemail1 ? "valid_input" : "invalid_input"
                      }`}
                      strong
                      editable={{
                        onChange: (str) => {
                          set_org_sender_email(str);
                        },
                      }}
                    >
                      {org_sender_email}
                    </Paragraph>
                    <Input
                      placeholder="AWS region"
                      value={aws_region}
                      onChange={(e) => set_aws_region(e.target.value)}
                    />
                    <Input
                      placeholder="AWS Access Key Id"
                      value={aws_access_key_id}
                      onChange={(e) => set_aws_access_key_id(e.target.value)}
                    />
                    <Input.Password
                      placeholder="Secret Access Key"
                      value={aws_secret_key}
                      onChange={(e) => set_aws_secret_key(e.target.value)}
                    />
                  </Space>
                </Col>
                <Col span="6">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Text type="secondary">EMAIL ARE SENT THROUGH</Text>
                    <Paragraph
                      strong
                      className={`${
                        validemail2 ? "valid_input" : "invalid_input"
                      }`}
                      editable={{
                        onChange: (str) => {
                          set_org_send_through(str);
                        },
                      }}
                    >
                      {org_send_through}
                    </Paragraph>
                    <Input.Password
                      placeholder="google account app password"
                      value={g_account_password}
                      onChange={(e) => set_g_account_password(e.target.value)}
                    />
                    <Link
                      style={{ fontSize: "smaller" }}
                      href="https://support.google.com/accounts/answer/185833"
                      target="_blank"
                    >
                      how to get account app password?
                    </Link>
                  </Space>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong>Facebook Integration</Text>
                </Col>
                <Col span="6">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Text type="secondary">FB APP ID</Text>
                    <Input
                      placeholder="APP ID"
                      value={fb_app_id}
                      onChange={(e) => set_fb_app_id(e.target.value)}
                    />
                  </Space>
                </Col>
                <Col span="6">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Text type="secondary">FB PAGE ID</Text>
                    <Input
                      placeholder="PAGE ID"
                      value={fb_page_id}
                      onChange={(e) => set_fb_page_id(e.target.value)}
                    />
                  </Space>
                </Col>
              </Row>
              {/* <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong>Paypal Integration</Text>
                </Col>
                <Col span="6">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Input
                      placeholder="Paypal Client Id"
                      value={paypal_client_id}
                      onChange={(e) => set_paypal_client_id(e.target.value)}
                    />
                  </Space>
                </Col>
              </Row> */}
              {/* <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong>Google Map API Key</Text>
                </Col>
                <Col span="6">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Input
                      placeholder="Google Map API Key"
                      value={google_api_key}
                      onChange={(e) => set_google_api_key(e.target.value)}
                    />
                  </Space>
                </Col>
              </Row> */}
              <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong>Base Currency</Text>
                </Col>
                <Col span="9">
                  <Select
                    style={{ width: "100%" }}
                    onChange={(value) => set_org_base_currency(value)}
                    value={org_base_currency}
                  >
                    <Option value="PHP">PHP</Option>
                  </Select>
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}>
                  <Text strong>Date Format</Text>
                </Col>
                <Col span="9">
                  <Select
                    style={{ width: "100%" }}
                    onChange={(value) => set_org_date_format(value)}
                    value={org_date_format}
                  >
                    <Option value="MM-DD-YYYY">MM-DD-YYYY (12-31-2020)</Option>
                    <Option value="DD-MM-YYYY">DD-MM-YYYY (31-12-2020)</Option>
                    <Option value="YYYY-MM-DD">YYYY-MM-DD (2020-12-31)</Option>
                    <Option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2020)</Option>
                    <Option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2020)</Option>
                    <Option value="YYYY/MM/DD">YYYY/MM/DD (2020/12/31)</Option>
                  </Select>
                </Col>
              </Row>
              <Divider />
              <Row gutter={[16, 16]} align="middle">
                <Col span="4" style={{ textAlign: "right" }}></Col>
                <Col span="18" style={{ textAlign: "right" }}>
                  <Button
                    type="primary"
                    loading={submit_loading}
                    onClick={() => {
                      submit_org_settings();
                    }}
                  >
                    {submit_loading ? "Saving..." : "Save"}
                  </Button>
                </Col>
              </Row>
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
