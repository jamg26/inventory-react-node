import React, { useState, useEffect } from "react";
import { Tag, Button, AutoComplete } from "antd";
import axios from "axios";
import { api_base_url, api_base_url_orders } from "../../../../keys/index";

const { Option } = AutoComplete;
function AddTag() {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

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

  const handleChange = (data) => {
    setInputValue(data);
  };
  const addTag = () => {
    setSelectedTags([
      ...selectedTags,
      {
        id: selectedTags.length,
        value: inputValue,
      },
    ]);
    var index = tags.findIndex(function (item, i) {
      return item.product_tag_name === inputValue;
    });
    if (index > -1) {
      tags.splice(index, 1);
    }
    setInputValue("");
  };
  const handleClose = (id, value) => {
    var index = selectedTags.findIndex(function (item, i) {
      return item.value === value;
    });
    if (index > -1) {
      selectedTags.splice(index, 1);
      setTags([
        ...tags,
        {
          id: id,
          product_tag_name: value,
        },
      ]);
    }
    setInputValue("");
    //console.log([...tags]);
  };
  return (
    <div>
      <label style={{ fontWeight: "bold" }}>Tags</label>
      <div>
        <AutoComplete
          style={{ width: "50%" }}
          value={inputValue}
          onChange={handleChange}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        >
          {tags.map((tag) => (
            <Option key={tag.id} value={tag.product_tag_name}>
              {tag.product_tag_name}
            </Option>
          ))}
        </AutoComplete>
        <Button style={{ marginLeft: 10, fontWeight: "bold" }} onClick={addTag}>
          Add
        </Button>
      </div>
      {selectedTags.map((tag, index) => {
        return (
          <Tag
            closable
            key={tag.id}
            onClose={() => handleClose(tag.id, tag.value)}
          >
            {tag.value}
          </Tag>
        );
      })}
    </div>
  );
}

export default AddTag;
