import React, { useState, useEffect } from "react";
import {
  Input,
  Modal,
  Typography,
  Card,
  Table,
  Tag,
  InputNumber,
  Button,
  Empty,
  Col,
  Row,
  Radio,
  Space,
  Descriptions,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import numeral from "numeral";
import { DeleteOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Text, Title } = Typography;
const { TextArea } = Input;

function Product_modal({
  product_modal_visible,
  close,
  modal_data,
  setInput,
  handleAddToCart,
  show,
}) {
  useEffect(() => {
    console.log(modal_data);
  }, [modal_data]);
  if (modal_data == undefined) {
    return null;
  } else {
    return [
      <>
        <Modal
          visible={product_modal_visible}
          onOk={close}
          onCancel={close}
          className="catalogue_close_button"
          width={"60%"}
          footer={null}
        >
          <Row gutter={[16, 16]} align={"middle"}>
            <Col span={12} style={{ textAlign: "center" }}>
              {modal_data.category_modal_image}
            </Col>
            <Col span={2} style={{ textAlign: "center" }}></Col>
            <Col span={10}>
              <table style={{ height: "90%", width: "90%" }}>
                <tr>
                  <td style={{ verticalAlign: "top" }}>
                    <Space direction="vertical" size="2">
                      <Text style={{ fontSize: "22px" }} strong>
                        {modal_data.product_name}
                      </Text>
                      <Space direction="vertical" size="0">
                        <Text style={{ fontSize: "16px" }} type="secondary">
                          {modal_data.weight}
                        </Text>
                        <Text style={{ fontSize: "16px" }} type="secondary">
                          {modal_data.color}
                        </Text>
                        <Text style={{ fontSize: "16px" }} type="secondary">
                          {modal_data.size}
                        </Text>
                      </Space>
                    </Space>
                    <br />
                    <br />
                    <Text strong style={{ fontSize: "16px" }}>
                      Description :
                    </Text>
                    <Text style={{ fontSize: "16px" }} type="secondary">
                      {modal_data.product_description}
                    </Text>
                    <br />
                    <br />
                    <table>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              verticalAlign: "middle",
                              textAlign: "right",
                            }}
                          >
                            <Text strong style={{ fontSize: "16px" }}>
                              Category :{" "}
                            </Text>
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              textAlign: "left",
                            }}
                          >
                            <Text style={{ fontSize: "16px" }} type="secondary">
                              {modal_data.product_type}
                            </Text>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              verticalAlign: "middle",
                              textAlign: "right",
                            }}
                          >
                            <Text strong style={{ fontSize: "16px" }}>
                              Tags :{" "}
                            </Text>
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              textAlign: "left",
                            }}
                          >
                            <Text style={{ fontSize: "16px" }} type="secondary">
                              {modal_data.tags}
                            </Text>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              verticalAlign: "middle",
                              textAlign: "right",
                            }}
                          >
                            <Text strong style={{ fontSize: "16px" }}>
                              Stock :{" "}
                            </Text>
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              textAlign: "left",
                            }}
                          >
                            <Text style={{ fontSize: "16px" }} type="secondary">
                              {modal_data.stock} {modal_data.quantity} available
                            </Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <br />
                    <br />
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "bottom" }}>
                    <Row gutter={[16, 16]}>
                      <Col span="9" style={{ textAlign: "center" }}>
                        <Text strong style={{ fontSize: "18px" }}>
                          {"\u20B1"}
                          {modal_data.price}
                        </Text>
                      </Col>
                      <Col span="6" style={{ textAlign: "center" }}>
                        <table className="def-number-input number-input">
                          <tbody>
                            <tr>
                              <td
                                className="hoverabletd"
                                style={{
                                  verticalAlign: "middle",
                                  textAlign: "center",
                                  padding: 0,
                                }}
                                onClick={() => {
                                  if (
                                    parseFloat(modal_data.initial_quantity) -
                                      parseFloat(1) >=
                                    0
                                  ) {
                                    setInput(
                                      parseFloat(modal_data.initial_quantity) -
                                        parseFloat(1),
                                      modal_data.key,
                                      "initial_quantity"
                                    );
                                  }
                                }}
                              >
                                <button className="minus"></button>
                              </td>
                              <td
                                style={{
                                  verticalAlign: "middle",
                                  textAlign: "center",
                                  padding: 0,
                                }}
                              >
                                <input
                                  disabled={
                                    modal_data.quantity > 0 ||
                                    !modal_data.alreadyincart
                                      ? false
                                      : true
                                  }
                                  className="quantity"
                                  name="quantity"
                                  value={modal_data.initial_quantity}
                                  min={0}
                                  max={parseFloat(modal_data.quantity)}
                                  onChange={(event) => {
                                    console.log("event", event.target.value);
                                    if (parseFloat(event.target.value) < 0) {
                                      setInput(
                                        0,
                                        modal_data.key,
                                        "initial_quantity"
                                      );
                                    } else if (
                                      parseFloat(event.target.value) >
                                      parseFloat(modal_data.quantity)
                                    ) {
                                      setInput(
                                        modal_data.quantity,
                                        modal_data.key,
                                        "initial_quantity"
                                      );
                                    } else {
                                      setInput(
                                        event.target.value,
                                        modal_data.key,
                                        "initial_quantity"
                                      );
                                    }
                                  }}
                                  type="number"
                                />
                              </td>
                              <td
                                className="hoverabletd"
                                style={{
                                  verticalAlign: "middle",
                                  textAlign: "center",
                                  padding: 0,
                                }}
                                onClick={() => {
                                  if (
                                    parseFloat(modal_data.initial_quantity) +
                                      parseFloat(1) <=
                                    modal_data.quantity
                                  ) {
                                    setInput(
                                      parseFloat(modal_data.initial_quantity) +
                                        parseFloat(1),
                                      modal_data.key,
                                      "initial_quantity"
                                    );
                                  }
                                }}
                              >
                                <button className="plus"></button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                      <Col span="9" style={{ textAlign: "center" }}>
                        <Text strong style={{ fontSize: "18px" }}>
                          {"\u20B1"}
                          {modal_data.sub_total}
                        </Text>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col span="24" style={{ textAlign: "center" }}>
                        <>
                          {modal_data.quantity > 0 ? (
                            modal_data.alreadyincart ? (
                              <Button type="primary" block onClick={show}>
                                View Cart
                              </Button>
                            ) : (
                              <Button
                                className="ant-btn-succcess"
                                block
                                disabled={
                                  modal_data.quantity > 0 &&
                                  modal_data.initial_quantity > 0
                                    ? false
                                    : true
                                }
                                onClick={() => {
                                  handleAddToCart(
                                    modal_data.actionData,
                                    modal_data
                                  );
                                }}
                              >
                                <ShoppingCartOutlined /> Add to Cart
                              </Button>
                            )
                          ) : (
                            <Button
                              block
                              disabled={modal_data.quantity > 0 ? false : true}
                            >
                              <ShoppingCartOutlined /> Out of Stock
                            </Button>
                          )}
                        </>
                        {/* <Button
                          className="ant-btn-succcess"
                          size="large"
                          disabled={modal_data.quantity > 0 ? false : true}
                          onClick={() => {
                            handleAddToCart(modal_data.actionData, modal_data);
                          }}
                        >
                          Add to Cart
                        </Button> */}
                      </Col>
                    </Row>
                  </td>
                </tr>
              </table>
            </Col>
          </Row>
        </Modal>
      </>,
    ];
  }
}
export default Product_modal;
