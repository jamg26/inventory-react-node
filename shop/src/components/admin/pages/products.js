import React, { useEffect, useState } from "react";
import { UserContext } from "../../../routes/routes";
import { Button, Layout, Menu, PageHeader, Tabs, Typography, Form } from "antd";
import { ArrowRightOutlined, FastForwardOutlined } from "@ant-design/icons";
import { checkAuth } from "../../helper/authCheckAdmin";
import Side from "../inc/side";
import Header from "../inc/header";
import { withRouter } from "react-router-dom";
import Search from "./tab-add-product/search";
import AddProduct from "./tab-add-product/add_product";
import { api_base_url, api_base_url_orders } from "../../../keys/index";
import UploadImage from "./tab-add-product/file_upload";
import TagList from "./tab-product-tags/tag_list";
import Variant from "./tab-add-product/variant";
import ProductList from "./tab-products/product_list";
import VariantList from "./tab-product-variants/variant_list";
import LoadingPage from "../../global-components/loading";
import axios from "axios";
const { Content } = Layout;
const { TabPane } = Tabs;

function Dashboard(props) {
  const [showComponent, setShowComponent] = useState(false);
  useEffect(() => {
    checkAuth(props, setShowComponent);
  }, []);
  console.log(props);
  const initialProductTypeState = {
    _id: "",
    product_type_name: "",
    product_type_description: "",
    product_type_active: true,
  };
  const initialProductTagState = {
    _id: "",
    tag_label: "",
  };
  const initialSupplierState = {
    _id: "",
    company_name: "",
    supplier_code: "",
  };
  const initialVariantState = {
    _id: "",
    option_title: "",
    supplier: initialSupplierState,
    supplier_price: "",
    price_with_tax: "",
    price_without_tax: "",
    sku: "",
    price: "",
    images: "",
    discounter_price: "",
    discounted: false,
    barcode: "",
    quantity: "",
    brand: "",
    color: "",
    size: "",
    active: false,
  };
  const initialProductState = {
    _id: "",
    product_name: "",
    product_description: "",
    product_type: initialProductTypeState,
    product_tags: [initialProductTagState],
    active: false,
    variants: [initialVariantState],
  };
  const [collaped, setCollaped] = useState(false);
  const [variant, setVariant] = useState(initialVariantState);
  const [product, setProduct] = useState(initialProductState);
  const toggle = (key) => {
    setCollaped(!collaped);
    //console.log(key);
  };
  //states of product
  const [productName, setProductName] = useState(product.product_name);
  const [productDesc, setProductDesc] = useState(product.product_description);
  const [productType, setProductType] = useState(
    product.product_type.product_type_name
  );
  const [productBrand, setProductBrand] = useState(variant.brand);
  const [productSupplier, setProductSupplier] = useState(
    variant.supplier.company_name
  );
  const [productSupplierCode, setProductSupplierCode] = useState(
    variant.supplier.supplier_code
  );
  const [productSKU, setProductSKU] = useState(variant.sku);
  const [productBarcode, setProductBarcode] = useState(variant.barcode);
  const [productInitialStock, setProductInitialStock] = useState(
    variant.quantity
  );
  const [productSupplyPrice, setProductSupplyPrice] = useState(
    variant.supplier_price
  );
  const [prodMarkup, setProdMarkup] = useState("");

  //states of tag
  const [inputValue, setInputValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const handleChange = (data) => {
    setInputValue(data);
  };

  //states of pricing
  const testData = {
    id: "0",
    supply_price: "",
    markup: "",
    retail_no_tax: "",
    retail_with_tax: "",
    final_retail_price: "",
  };
  const pricingColumns = [
    {
      title: "Supply Price",
      dataIndex: "supply_price",
      render: (value) => (
        <p style={{ marginBottom: -3 }}>{"₱" + productSupplyPrice}</p>
      ),
    },
    {
      title: "Markup (%)",
      dataIndex: "markup",
      render: (value) => <p style={{ marginBottom: -3 }}>{prodMarkup + "%"}</p>,
    },
    {
      title: "Retail Price (w/o tax)",
      dataIndex: "retail_no_tax",
      render: (value) => (
        <p style={{ marginBottom: -3 }}>
          {(parseInt(prodMarkup) * parseInt(productSupplyPrice)) / 100 +
          parseInt(productSupplyPrice)
            ? "₱" +
              ((parseInt(prodMarkup) * parseInt(productSupplyPrice)) / 100 +
                parseInt(productSupplyPrice))
            : "₱"}
        </p>
      ),
    },
    {
      title: "Retail Price (w/ tax)",
      dataIndex: "retail_with_tax",
      render: (value) => (
        <p style={{ marginBottom: -3 }}>
          {(parseInt(prodMarkup) * parseInt(productSupplyPrice)) / 100 +
          parseInt(productSupplyPrice) +
          parseInt(productSupplyPrice) * parseFloat(0.12)
            ? "₱" +
              (
                (parseInt(prodMarkup) * parseInt(productSupplyPrice)) / 100 +
                parseInt(productSupplyPrice) +
                parseInt(productSupplyPrice) * parseFloat(0.12)
              ).toFixed(2)
            : "₱"}
        </p>
      ),
    },
    {
      title: "Final Retail Price",
      dataIndex: "final_retail_price",
      render: (value) => (
        <p style={{ marginBottom: -3 }}>
          {(parseInt(prodMarkup) * parseInt(productSupplyPrice)) / 100 +
          parseInt(productSupplyPrice) +
          parseInt(productSupplyPrice) * parseFloat(0.12)
            ? "₱" +
              (
                (parseInt(prodMarkup) * parseInt(productSupplyPrice)) / 100 +
                parseInt(productSupplyPrice) +
                parseInt(productSupplyPrice) * parseFloat(0.12)
              ).toFixed(2)
            : "₱"}
        </p>
      ),
    },
  ];
  const [pricingData, setPricingData] = useState([testData]);
  //state of image
  const [imagePreview, setImagePreview] = useState("");
  //states of variant
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [variantData, setVariantData] = useState([]);
  //const [submitVariant, setSubmitVariant] = useState([]);
  const applyVariant = () => {
    let newArray = [];
    selectedColors.forEach((element) => {
      selectedSizes.forEach((x) => {
        newArray.push((element + "/" + x).toString());
      });
    });
    let count = variantData.length;
    const newVariantData = [];
    for (let index = 0; index < newArray.length; index++) {
      count = index;
      var split = newArray[index].split("/");
      let newData = {
        id: count,
        option_title: productName + " - " + newArray[count],
        supplier: {
          company_name: productSupplier,
          supplier_code: productSupplierCode,
        },
        supplier_price: "₱" + productSupplyPrice,
        price_with_tax:
          "₱" +
          (
            (parseInt(prodMarkup) * parseInt(productSupplyPrice)) / 100 +
            parseInt(productSupplyPrice) +
            parseInt(productSupplyPrice) * parseFloat(0.12)
          )
            .toFixed(2)
            .toString(),
        price_without_tax:
          "₱" +
          (
            (parseInt(prodMarkup) * parseInt(productSupplyPrice)) / 100 +
            parseInt(productSupplyPrice)
          ).toString(),
        sku: productSKU,
        price:
          "₱" +
          (
            (parseInt(prodMarkup) * parseInt(productSupplyPrice)) / 100 +
            parseInt(productSupplyPrice) +
            parseInt(productSupplyPrice) * parseFloat(0.12)
          )
            .toFixed(2)
            .toString(),
        images: imagePreview,
        discounter_price: "₱" + productSupplyPrice,
        barcode: productBarcode,
        quantity: productInitialStock,
        brand: productBrand,
        color: split[0],
        size: split[1],
      };

      newVariantData.push(newData);
    }
    setVariantData(newVariantData);
  };

  const clearAllInputs = () => {
    setProductName("");
    setProductDesc("");
    setProductType("");
    setInputValue("");
    setSelectedTags([]);
    setImagePreview("");
    setProductBrand("");
    setProductSupplier("");
    setProductSupplierCode("");
    setProductSKU("");
    setProductBarcode("");
    setProductInitialStock("");
    setProductSupplyPrice("");
    setProdMarkup("");
    setSelectedColors([]);
    setSelectedSizes([]);
    setVariantData([]);
  };

  const addProduct = () => {
    if (productName === "") {
      alert("Please input a product name!");
    } else {
      var dataProdType = {
        product_type_name: productType,
        product_type_description: productType + " type description",
      };
      var dataProd = {
        product_name: productName,
        product_description: productDesc,
        product_type: undefined,
        product_tags: selectedTags,
        variants: variantData,
        active: true,
      };
      console.log(dataProd);
      axios
        .post(api_base_url_orders + "/products/add", dataProd)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err.message));
    }
    clearAllInputs();
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
                <TabPane tab="All Products" key="1">
                  <ProductList />
                </TabPane>
                <TabPane tab="Product Variants" key="2">
                  <VariantList />
                </TabPane>
                <TabPane tab="Product Tag List" key="3">
                  <TagList />
                </TabPane>
                <TabPane tab="Add Product" key="4">
                  <Form>
                    {/* <div style={{ padding: "10px" }}>
                      <Search />
                    </div> */}
                    <div
                      style={{
                        borderTop: "1px solid black",
                        fontWeight: "bold",
                        fontSize: "17px",
                        color: "black",
                        backgroundColor: "#e1e4e8",
                        padding: "10px 10px 10px 40px",
                      }}
                    >
                      Add product
                    </div>
                    <div
                      style={{ padding: "15px 0px 0px 0px", display: "flex" }}
                    >
                      <div style={{ width: "55%" }}>
                        <AddProduct
                          prodName={productName}
                          setProdName={(val) => setProductName(val)}
                          prodDesc={productDesc}
                          setProdDesc={(val) => setProductDesc(val)}
                          prodType={productType}
                          setProdType={(val) => setProductType(val)}
                          prodBrand={productBrand}
                          setProdBrand={(val) => setProductBrand(val)}
                          prodSupp={productSupplier}
                          setProdSupp={(val) => setProductSupplier(val)}
                          prodSuppCode={productSupplierCode}
                          setProdSuppCode={(val) => setProductSupplierCode(val)}
                          prodSKU={productSKU}
                          setProdSKU={(val) => setProductSKU(val)}
                          prodBcode={productBarcode}
                          setProdBcode={(val) => setProductBarcode(val)}
                          prodIniStock={productInitialStock}
                          setProdIniStock={(val) => setProductInitialStock(val)}
                          inputTag={inputValue}
                          handleInput={handleChange}
                          setInputTag={(val) => setInputValue(val)}
                          selectTag={selectedTags}
                          setSelectTag={setSelectedTags}
                          prodSuppPrice={productSupplyPrice}
                          setProdSuppPrice={(val) => setProductSupplyPrice(val)}
                          markup={prodMarkup}
                          setMarkup={(val) => setProdMarkup(val)}
                        />
                      </div>
                      <div style={{ flexGrow: 1, width: "45%" }}>
                        <UploadImage
                          imageFile={imagePreview}
                          setImageFile={setImagePreview}
                        />
                      </div>
                    </div>
                    <div>
                      <Variant
                        priceData={pricingData}
                        priceColumn={pricingColumns}
                        colors={selectedColors}
                        setColors={setSelectedColors}
                        sizes={selectedSizes}
                        setSizes={setSelectedSizes}
                        variants={variantData}
                        setVariants={setVariantData}
                        variantToTable={applyVariant}
                        markupData={prodMarkup}
                      />
                    </div>
                    <div style={{ float: "right" }}>
                      <Button onClick={clearAllInputs}>Cancel</Button>
                      <Button
                        style={{ marginLeft: 25 }}
                        type={"primary"}
                        onClick={addProduct}
                        htmlType={"submit"}
                      >
                        Save New Product
                      </Button>
                    </div>
                  </Form>
                </TabPane>
                <TabPane tab="Low Stock" key="5">
                  Content of Tab Pane 3
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

export default withRouter(Dashboard);
