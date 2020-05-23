import React, { useState, useEffect } from "react";
import { Input, Tag, AutoComplete, Button } from "antd";
import axios from "axios";
import { api_base_url, api_base_url_orders } from "../../../../keys/index";
//import Tags from './product_tags';

const { Option } = AutoComplete;
function AddProduct(props) {
  const {
    prodName,
    setProdName,
    prodDesc,
    setProdDesc,
    prodType,
    setProdType,
    prodBrand,
    setProdBrand,
    prodSupp,
    setProdSupp,
    prodSuppCode,
    setProdSuppCode,
    prodSKU,
    setProdSKU,
    prodBcode,
    setProdBcode,
    prodIniStock,
    setProdIniStock,
    prodSuppPrice,
    setProdSuppPrice,
    inputTag,
    setInputTag,
    handleInput,
    selectTag,
    setSelectTag,
    markup,
    setMarkup,
  } = props;

  const labelStyle = {
    fontWeight: "bold",
  };
  const [tags, setTags] = useState([]);

  useEffect(() => {
    retrieveAllActiveTags();
  }, []);

  const retrieveAllActiveTags = () => {
    axios
      .get(api_base_url_orders + "/product_tags/active")
      .then((res) => {
        setTags(res.data);
        console.log(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const addTag = () => {
    setSelectTag([
      ...selectTag,
      {
        id: selectTag.length,
        tag_label: inputTag,
        value: inputTag,
      },
    ]);
    /*var index = tags.findIndex(function (item, i) {
            return item.product_tag_name === inputTag;
        })
        if (index > -1) {
            tags.splice(index, 1);
        }*/
    //setInputValue('')
    console.log(selectTag);
    setInputTag("");
  };
  /*const handleClose = (id, value) => {
        var index = selectedTags.findIndex(function (item, i) {
            return item.value === value;
        })
        if (index > -1) {
            selectedTags.splice(index, 1);
            setTags([...tags, {
                id: id,
                product_tag_name: value
            }])
        }
        //setInputValue('')
        setInputTag('')
    }*/
  return (
    <div style={{ backgroundColor: "#edf1f5", padding: "40px" }}>
      <div style={{ paddingBottom: "25px" }}>
        <label style={labelStyle}>
          Name<label style={{ color: "red" }}>*</label>
        </label>
        <div>
          <Input
            value={prodName}
            onChange={(e) => setProdName(e.target.value)}
            style={{ width: "50%" }}
            type="text"
          />
        </div>
      </div>
      <div style={{ paddingBottom: "25px" }}>
        <label style={labelStyle}>Description</label>
        <div>
          <Input
            value={prodDesc}
            onChange={(e) => setProdDesc(e.target.value)}
            style={{ width: "50%" }}
            type="text"
          />
        </div>
      </div>
      <div style={{ paddingBottom: "25px" }}>
        <label style={{ fontWeight: "bold" }}>Tags</label>
        <div>
          <AutoComplete
            style={{ width: "50%" }}
            value={inputTag}
            onChange={handleInput}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          >
            {tags.map((tag) => (
              <Option key={tag.id} value={tag.product_tag_name}>
                {tag.product_tag_name}
              </Option>
            ))}
          </AutoComplete>
          <Button
            style={{ marginLeft: 10, fontWeight: "bold" }}
            onClick={addTag}
          >
            Add
          </Button>
        </div>
        {selectTag.map((tag, index) => {
          return (
            <Tag
              closable
              key={tag.id}
              //onClose={() => handleClose(tag.id, tag.value)}
            >
              {tag.value}
            </Tag>
          );
        })}
      </div>
      <div style={{ paddingBottom: "25px" }}>
        <label style={labelStyle}>Product Type</label>
        <div>
          <Input
            value={prodType}
            onChange={(e) => setProdType(e.target.value)}
            style={{ width: "50%" }}
            type="text"
          />
        </div>
      </div>
      <div style={{ paddingBottom: "25px" }}>
        <label style={labelStyle}>Brand</label>
        <div>
          <Input
            value={prodBrand}
            onChange={(e) => setProdBrand(e.target.value)}
            style={{ width: "50%" }}
            type="text"
          />
        </div>
      </div>
      <div style={{ paddingBottom: "25px" }}>
        <label style={labelStyle}>Supplier</label>
        <label style={{ fontWeight: "bold", marginLeft: "58%" }}>
          Supplier Code
        </label>
        <div>
          <Input
            value={prodSupp}
            onChange={(e) => setProdSupp(e.target.value)}
            style={{ width: "50%" }}
            type="text"
          />
          <Input
            value={prodSuppCode}
            onChange={(e) => setProdSuppCode(e.target.value)}
            style={{ width: "30%", marginLeft: "19%" }}
            type="text"
          />
        </div>
      </div>
      <div style={{ paddingBottom: "25px" }}>
        <label style={labelStyle}>SKU</label>
        <label style={{ fontWeight: "bold", marginLeft: "63%" }}>Barcode</label>
        <div>
          <Input
            value={prodSKU}
            onChange={(e) => setProdSKU(e.target.value)}
            style={{ width: "50%" }}
            type="text"
          />
          <Input
            value={prodBcode}
            onChange={(e) => setProdBcode(e.target.value)}
            style={{ width: "30%", marginLeft: "19%" }}
            type="text"
          />
        </div>
      </div>
      <div style={{ paddingBottom: "25px" }}>
        <label style={labelStyle}>Initial stock</label>
        <div>
          <Input
            value={prodIniStock}
            onChange={(e) => setProdIniStock(e.target.value)}
            style={{ width: "50%" }}
            type="text"
          />
        </div>
      </div>
      <div style={{ paddingBottom: "25px" }}>
        <label style={labelStyle}>Supply Price</label>
        <label style={{ fontWeight: "bold", marginLeft: "53%" }}>Markup</label>
        <div>
          <Input
            value={prodSuppPrice}
            onChange={(e) => setProdSuppPrice(e.target.value)}
            style={{ width: "50%" }}
            type="text"
          />
          <Input
            value={markup}
            onChange={(e) => setMarkup(e.target.value)}
            style={{ width: "30%", marginLeft: "19%" }}
            type="text"
          />
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
