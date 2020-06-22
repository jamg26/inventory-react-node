import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Switch,
  Button,
  Input,
  Space,
  Empty,
  Modal,
  Row,
  Col,
  Descriptions,
  InputNumber,
  message,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  SaveOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios";
import numeral from "numeral";
import ImageUpload from "../tab-add-product/file_upload";
import { api_base_url, api_base_url_products } from "../../../../keys/index";
const { Text } = Typography;
function EditVariant({ edit_product_modal, edit_data, close, refresh }) {
  const [variant_name, set_variant_name] = useState("");
  const [sku, set_sku] = useState("");
  const [brand, set_brand] = useState("");
  const [color, set_color] = useState("");
  const [size, set_size] = useState("");
  const [supplier_price, set_supplier_price] = useState(0);
  const [variant_markup, set_variant_markup] = useState(0);
  const [price_wo_tax, set_price_wo_tax] = useState(0);
  const [price_w_tax, set_price_w_tax] = useState(0);
  const [final_price, set_final_price] = useState(0);
  const [imageFile, setImageFile] = useState("");
  useEffect(() => {
    if (edit_data && edit_data.variant_info) {
      console.log(edit_data);
      setImageFile(edit_data.variant_info.images);
      set_variant_name(edit_data.variant_info.option_title);
      set_sku(edit_data.variant_info.sku);
      set_brand(edit_data.variant_info.brand);
      set_color(edit_data.variant_info.color);
      set_size(edit_data.variant_info.size);
      set_supplier_price(
        edit_data.variant_info.supplier_price
          ? edit_data.variant_info.supplier_price
          : 0
      );
      set_variant_markup(
        edit_data.variant_info.markup ? edit_data.variant_info.markup : 0
      );
      set_price_wo_tax(
        edit_data.variant_info.price_without_tax
          ? edit_data.variant_info.price_without_tax
          : 0
      );
      set_price_w_tax(
        edit_data.variant_info.price_with_tax
          ? edit_data.variant_info.price_with_tax
          : 0
      );
      set_final_price(
        edit_data.variant_info.price ? edit_data.variant_info.price : 0
      );
    }
  }, [edit_data]);
  useEffect(() => {
    if (supplier_price !== "" && variant_markup !== "") {
      let supplier_price_temp = supplier_price;
      let supplier_markup = parseFloat(variant_markup) / parseFloat(100);
      set_price_wo_tax(
        parseFloat(supplier_price_temp) +
          parseFloat(supplier_price_temp) * parseFloat(supplier_markup)
      );
      set_price_w_tax(
        parseFloat(supplier_price_temp) +
          parseFloat(supplier_price_temp) * parseFloat(supplier_markup) +
          parseFloat(supplier_price_temp) * parseFloat(0.12)
      );
      set_final_price(
        parseFloat(supplier_price_temp) +
          parseFloat(supplier_price_temp) * parseFloat(supplier_markup) +
          parseFloat(supplier_price_temp) * parseFloat(0.12)
      );
    }
  }, [supplier_price, variant_markup]);

  const submitEdit = async () => {
    if (edit_data) {
      try {
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await axios.post(
          api_base_url_products + "/products/update_variant",
          {
            product_id: edit_data.parent_id,
            variant_id: edit_data.variant_id,
            variant_name,
            sku,
            brand,
            color,
            size,
            supplier_price,
            variant_markup,
            price_wo_tax,
            price_w_tax,
            final_price,
            imageFile,
          },
          { headers: headers }
        );
        if (response.data == "Successfully Updated Variant Details") {
          message.success(response.data);
          refresh();
          close();
        } else {
          message.error(response.data);
        }
      } catch (error) {
        message.error("something went wrong!");
      }
    } else {
      message.error("please select a variant to edit");
      close();
    }
  };
  return [
    <Modal
      title={
        edit_data && edit_data.variant_name
          ? edit_data.variant_name
          : "Undefined Variant Name"
      }
      visible={edit_product_modal}
      width="30%"
      okText="Submit"
      onOk={() => {
        submitEdit();
      }}
      onCancel={() => {
        close();
      }}
    >
      <Row gutter={[24, 24]}>
        <Col span="24">
          <ImageUpload imageFile={imageFile} setImageFile={setImageFile} />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span="24">
          <Text>Variant Name</Text>
          <Input
            placeholder="Variant Name"
            value={variant_name}
            onChange={(event) => set_variant_name(event.target.value)}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span="24">
          <Text>SKU</Text>
          <Input
            placeholder="Variant Name"
            value={sku}
            onChange={(event) => set_sku(event.target.value)}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span="24">
          <Text>Brand</Text>
          <Input
            placeholder="Variant Name"
            value={brand}
            onChange={(event) => set_brand(event.target.value)}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span="24">
          <Text>Variant: Color</Text>
          <Input
            placeholder="Variant Name"
            value={color}
            onChange={(event) => set_color(event.target.value)}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span="24">
          <Text>Variant: Size</Text>
          <Input
            placeholder="Variant Name"
            value={size}
            onChange={(event) => set_size(event.target.value)}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span="12">
          <Text>
            Supplier Price <span style={{ color: "red" }}>*</span>
          </Text>
          <InputNumber
            style={{ width: "100%" }}
            value={supplier_price}
            min={0}
            onChange={(event) => set_supplier_price(event)}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Col>
        <Col span="12">
          <Text>
            Markup(%) <span style={{ color: "red" }}>*</span>
          </Text>
          <InputNumber
            style={{ width: "100%" }}
            value={variant_markup}
            min={0}
            onChange={(event) => set_variant_markup(event)}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span="24">
          <Descriptions
            bordered
            title="Pricing"
            size={"small"}
            column={1}
            style={{ width: "fit-content" }}
            className="LeftRightDescrptionContainer"
          >
            <Descriptions.Item
              label="Retail Price(w/o tax)"
              style={{ textAlign: "right" }}
            >
              {numeral(price_wo_tax).format("0,0.00")}
            </Descriptions.Item>
            <Descriptions.Item label="Tax" style={{ textAlign: "right" }}>
              {numeral(parseFloat(price_wo_tax) * parseFloat(0.12)).format(
                "0,0.00"
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label="Retail Price(w tax)"
              style={{ textAlign: "right" }}
            >
              {numeral(price_w_tax).format("0,0.00")}
            </Descriptions.Item>
            <Descriptions.Item
              label="Final Retail Price"
              style={{ textAlign: "right" }}
            >
              {numeral(final_price).format("0,0.00")}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Modal>,
  ];
}

export default EditVariant;
