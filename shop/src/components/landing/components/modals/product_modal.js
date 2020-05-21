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
          width={"40%"}
          footer={null}
        >
          <Row gutter={[16, 16]} align={"middle"}>
            <Col span={10} style={{ textAlign: "center" }}>
              {modal_data.category_modal_image}
            </Col>
            <Col span={14}>
              <table style={{ height: "90%", marginTop: "10%" }}>
                <tr>
                  <td style={{ verticalAlign: "top" }}>
                    <Text style={{ fontSize: "22px" }} strong>
                      {modal_data.product_name}
                    </Text>
                    <br />
                    <Text style={{ fontSize: "16px" }} type="secondary">
                      {modal_data.weight}
                    </Text>
                    <br />
                    <Text style={{ fontSize: "16px" }} type="secondary">
                      {modal_data.color}
                    </Text>
                    <br />
                    <Text style={{ fontSize: "16px" }} type="secondary">
                      {modal_data.size}
                    </Text>
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
                    <Text strong style={{ fontSize: "16px" }}>
                      Category :{" "}
                    </Text>
                    <Text style={{ fontSize: "16px" }} type="secondary">
                      {modal_data.product_type}
                    </Text>
                    <br />
                    <Text strong style={{ fontSize: "16px" }}>
                      Tags :{" "}
                    </Text>
                    <Text style={{ fontSize: "16px" }} type="secondary">
                      {modal_data.tags}
                    </Text>
                    <br />
                    <Text strong style={{ fontSize: "16px" }}>
                      Stock :{" "}
                    </Text>
                    <Text style={{ fontSize: "16px" }} type="secondary">
                      {modal_data.stock} {modal_data.quantity} available
                    </Text>
                    <br />
                    <br />
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "bottom" }}>
                    <Row gutter={[16, 16]}>
                      <Col span="8">
                        <Text strong>
                          {"\u20B1"}
                          {modal_data.price}
                        </Text>
                      </Col>
                      <Col span="8" style={{ textAlign: "center" }}>
                        <div
                          className={`quantity-input ${
                            modal_data.quantity > 0
                              ? ""
                              : "disabled_quantity_component"
                          }`}
                        >
                          <button
                            className="quantity-input__modifier quantity-input__modifier--left"
                            // onClick={this.decrement}
                            disabled={modal_data.quantity > 0 ? false : true}
                            onClick={(event) => {
                              if (modal_data.initial_quantity == 0) {
                              } else {
                                setInput(
                                  modal_data.initial_quantity === "" ||
                                    isNaN(modal_data.initial_quantity)
                                    ? 0
                                    : parseFloat(modal_data.initial_quantity) -
                                        1,
                                  modal_data.key,
                                  "initial_quantity"
                                );
                              }
                            }}
                          >
                            &mdash;
                          </button>
                          <input
                            className="quantity-input__screen"
                            type="text"
                            disabled={modal_data.quantity > 0 ? false : true}
                            value={modal_data.initial_quantity}
                            readOnly
                            // readonly
                            onBlur={() => {
                              if (
                                modal_data.initial_quantity === "" ||
                                isNaN(modal_data.initial_quantity)
                              ) {
                                setInput(
                                  modal_data.initial_quantity === "" ||
                                    isNaN(modal_data.initial_quantity)
                                    ? 0
                                    : modal_data.initial_quantity,
                                  modal_data.key,
                                  "initial_quantity"
                                );
                              }
                            }}
                            onChange={(event) => {
                              setInput(
                                modal_data.initial_quantity === "" ||
                                  isNaN(modal_data.initial_quantity)
                                  ? 0
                                  : event.target.value,
                                modal_data.key,
                                "initial_quantity"
                              );
                            }}
                          />
                          <button
                            disabled={modal_data.quantity > 0 ? false : true}
                            className="quantity-input__modifier quantity-input__modifier--right"
                            onClick={(event) => {
                              if (
                                modal_data.initial_quantity >=
                                modal_data.quantity
                              ) {
                              } else {
                                setInput(
                                  modal_data.initial_quantity === "" ||
                                    isNaN(modal_data.initial_quantity)
                                    ? 0
                                    : parseFloat(modal_data.initial_quantity) +
                                        parseFloat(1),
                                  modal_data.key,
                                  "initial_quantity"
                                );
                              }
                            }}
                          >
                            &#xff0b;
                          </button>
                        </div>
                      </Col>
                      <Col span="8" style={{ textAlign: "right" }}>
                        <Text strong>
                          {"\u20B1"}
                          {modal_data.sub_total}
                        </Text>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col span="24" style={{ textAlign: "center" }}>
                        <Button
                          className="ant-btn-succcess"
                          size="large"
                          disabled={modal_data.quantity > 0 ? false : true}
                          onClick={() => {
                            handleAddToCart(modal_data.actionData, modal_data);
                          }}
                        >
                          Add to Cart
                        </Button>
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
