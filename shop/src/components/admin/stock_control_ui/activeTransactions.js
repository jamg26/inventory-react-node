import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Upload, message, Typography, DatePicker, InputNumber, Col, Row, Descriptions } from 'antd';
import { CloseOutlined, CheckOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import { CSVLink } from "react-csv";
import axios from 'axios';
import moment from 'moment';

const Search = Input.Search;
const { TextArea } = Input;
const success = () => {
    message.success('Added New Product', 4);
};
const fillTheInput = () => {
    message.error('Please fill the necessary inputs', 4);
};
const rowAlreadyAdded = () => {
    message.info('Row has already been added', 4);
};
const EditableTable = () => {
    const initialProductTagState = {
        _id: '',
        po_no: "0",
        invoice_no: "0",
        supplier_note: "",
        total: 0,
        stock_source: "0",
        due_date: "November-25-1997",
        received: false,
        type: "",
        status: "Open",
        po_items: [
            {
                bill_to: "",
                ship_to: "",
                quantity: 0,
                delivery_due_date: "November-21-1997",
                item_cost: 0,
                tax: 0,
                total: 0,
            }
        ]
    };

    const [tag, setTag] = useState(initialProductTagState);

    const [loading, setLoading] = useState(false);
    const [x, setX] = useState(0);
    const dateFormat = 'YYYY/MM/DD';
    const [editingIndex, setEditingIndex] = useState(undefined);
    const [editable, setEditable] = useState(true);
    const [purchaseOrderData, setpurchaseOrderData] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredPurchaseOrderData, setfilteredPurchaseOrderData] = useState([]);
    const [toBeSaveData, setToBeSaveData] = useState();
    const [flag, setFlag] = useState(true);
    useEffect(() => {
        retrieveAllData();
    }, []);

    const retrieveAllData = () => {

        setLoading(true);
        axios.get('http://localhost:5001/purchase_orders/')

            .then(res => {
                setpurchaseOrderData(res.data);
                setfilteredPurchaseOrderData(res.data);
                setLoading(false);
                console.log(res.data);
            })
            .catch(function (err) {
                console.log(err);
            })
    };

    const toggleEdit = (index) => {
        setEditingIndex(index)
        setEditable(false)
    }

    const onSave = (id, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) => {
        const newData = {
            po_no: a,
            invoice_no: b,
            supplier_note: c,
            total: d,
            stock_source: e,
            due_date: f,
            received: g,
            type: h,
            status: i,
            po_items:
                [{
                    bill_to: j,
                    ship_to: k,
                    quantity: l,
                    delivery_due_date: m,
                    item_cost: n,
                    tax: o,
                    total: p,
                }]

        };
        console.log(id);
        axios.post('http://localhost:5001/purchase_orders/update/' + id, newData)
            .then(res => retrieveAllData())
            .catch(err => console.log(newData));
        setEditingIndex(undefined);
    }

    const columns = [
        {
            title: 'PO No.',
            dataIndex: 'po_no',
            render: (value, row, index) => {
                if (index === editingIndex) {
                    return [
                        <Input key={index} disabled={editable} value={value}
                            onChange={event => setInput(event.target.value, index, "po_no")}
                        />
                    ];
                } else {
                    return [
                        <Typography key={index} >{value}</Typography>
                    ];
                }
            }
        },
        {
            title: 'Type',
            dataIndex: 'type',
            render: (value, row, index) => {
                if (index === editingIndex) {
                    return [
                        <Input key={index} disabled={editable} value={value}
                            onChange={event => setInput(event.target.value, index, "type")}
                        />
                    ];
                } else {
                    return [
                        <Typography key={index} >{value}</Typography>
                    ];
                }
            }
        },
        {
            title: 'Supplier/Source',
            dataIndex: 'supplier',
            key: 'supplier',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [
                {
                    text: 'Open',
                    value: 'Open',
                },
                {
                    text: 'Closed',
                    value: 'Closed',
                },
                {
                    text: 'Draft',
                    value: 'Draft',
                },
                {
                    text: 'Issued',
                    value: 'Issued',
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            sortDirections: ['descend', 'ascend'],
            render: (value, row, index) => {
                if (index === editingIndex) {
                    return [
                        <Input key={index} disabled={editable} value={value} 
                            onChange={event => setInput(event.target.value, index, "status")}
                        />
                    ];
                } else {
                    return [
                        <Typography key={index} style={{color:'Green'}} >{value}</Typography>
                    ];
                }
            }
        },
        {
            title: 'Received',
            dataIndex: 'received',
            render: (value, row, index) => {
                if (index === editingIndex) {
                    return [
                        <Input key={index} disabled={editable} value={value} 
                            onChange={event => setInput(event.target.value, index, "received")}
                        />
                    ];
                } else {
                    return [
                        <Typography key={index} >{value ? ("Yes"): ("No")}</Typography>
                    ];
                }
            }
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            render: (value, result, index) => {
                if (index === editingIndex) {
                    return [
                        <InputNumber key={index} disabled={editable} value={result.po_items[0].quantity} onChange={(event) => { setInputSub(event, index, "quantity") }} />
                    ];
                } else {
                    return [
                        <Typography key={index} >{result.po_items[0].quantity}</Typography>
                    ];
                }
            }
        },
        {
            title: 'Total Cost',
            dataIndex: 'total',
            render: (value, result, index) => {
                if (index === editingIndex) {
                    return [
                        <InputNumber key={index} disabled={editable} value={result.po_items[0].total} onChange={(event) => { setInputSub(event, index, "total") }} />
                    ];
                } else {
                    return [
                        <Typography key={index} >{result.po_items[0].quantity}</Typography>
                    ];
                }
            }
        },
        {
            title: 'Transaction Date',
            dataIndex: 'created_at',
            render: (value, result, index) => {
                if (index === editingIndex) {
                    return [
                        <DatePicker
                            format={dateFormat}
                            defaultValue={moment(result.po_items[0].created_at, dateFormat)}
                            key={index} disabled={editable} onChange={event => setInput(event, index, "created_at")} />
                    ];
                } else {
                    return [
                        <Typography key={index}>{value}</Typography>
                    ];
                }
            }
        },
        {
            title: 'Delivery Due',
            dataIndex: 'delviery_due_date',
            render: (value, result, index) => {
                if (index === editingIndex) {
                    return [
                        <DatePicker
                            format={dateFormat}
                            defaultValue={moment(result.po_items[0].delivery_due_date, dateFormat)}
                            key={index} disabled={editable} onChange={event => setInput(event, index, "delviery_due_date")} />
                    ];
                } else {
                    return [
                        <Typography key={index}>{(result.po_items[0].delivery_due_date )}</Typography>
                    ];
                }
            }
        },
        {
            title: 'Last Updated',
            dataIndex: 'updated_at',
            render: (value, result, index) => {
                if (index === editingIndex) {
                    return [
                        <DatePicker
                            format={dateFormat}
                            defaultValue={moment(result.po_items[0].updated_at, dateFormat)}
                            key={index} disabled={editable} onChange={event => setInput(event, index, "updated_at")} />
                    ];
                } else {
                    return [
                        <Typography key={index}>{(value)}</Typography>
                    ];
                }
            }
        },
        {
            title: 'Entry by',
            dataIndex: 'entryBy',
            key: 'entryBy',

        },
        {
            title: 'Received by',
            dataIndex: 'receivedBy',
            key: 'receivedBy',

        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a style={{ marginRight: 16 }}>View Item </a>
                </span>
            ),
        },
    ];



    const setInputSub = (value, index, sub_col) => {
        let tempdata = [...filteredPurchaseOrderData];
        tempdata[index]['po_items'][0][sub_col] = value;
        setfilteredPurchaseOrderData(tempdata);
    };


    const setInput = (value, index, column) => {
        let tempdata = [...filteredPurchaseOrderData];
        tempdata[index][column] = value;
        setfilteredPurchaseOrderData(tempdata);
    };


    // For Search Ni siya
    useEffect(() => {
        console.log(purchaseOrderData)
        setfilteredPurchaseOrderData(
            purchaseOrderData.filter(data =>

                data.po_no.toLowerCase().includes(search.toLowerCase()) ||
                data.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
                data.status.toLowerCase().includes(search.toLowerCase()) ||
                data.type.toLowerCase().includes(search.toLowerCase()) ||
                data.po_items[0].bill_to.toLowerCase().includes(search.toLowerCase()) ||
                data.po_items[0].ship_to.toLowerCase().includes(search.toLowerCase()) ||
                data.po_items[0].delivery_due_date.toLowerCase().includes(search.toLowerCase()) ||
                data.po_items[0].item_cost.toString().toLowerCase().includes(search.toLowerCase()) ||
                data.po_items[0].quantity.toString().toLowerCase().includes(search.toLowerCase()) ||
                data.po_items[0].tax.toString().toLowerCase().includes(search.toLowerCase()) ||
                data.po_items[0].total.toString().toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, purchaseOrderData]);
    // End of Search area

    //Add Row
    const handleAdd = () => {
        const countPo = filteredPurchaseOrderData.length + 1;
        if (flag == true) {
            const newData =
            {
                "_id": countPo,
                "key": countPo,
                "po_no": countPo,
                "invoice_no": countPo,
                "po_items": [{
                    "bill_to": "",
                    "ship_to": "",
                    "delivery_due_date": "2020-05-12",
                    "quantity": 0,
                    "item_cost": 0,
                    "tax": 0,
                    "total": 0
                }]
            };
            setfilteredPurchaseOrderData([...filteredPurchaseOrderData, newData]);
            setToBeSaveData([newData]);
            setFlag(false)

        }
        else {
            console.log("already added")
            rowAlreadyAdded();
        }

    };
    /// FOR ADD NEW PURCHASE ORDER
    const handleSubmit = event => {
        //event.preventDefault();
        for (let c = 0; c < toBeSaveData.length; c++) {
            console.log(toBeSaveData[c]);
            if (toBeSaveData[c]['productName'] == "" || toBeSaveData[c]['supplier'] == "" || toBeSaveData[c]['bill_to'] == "" || toBeSaveData[c]['ship_to'] == "" ||
                toBeSaveData[c]['deliveryDue'] == "") {
                console.log("something missing");
                fillTheInput();
            }
            else {
                //   
                window.location.reload(true);
                axios.post("http://localhost:5001/purchase_orders/add", {
                    "key": toBeSaveData[c].key,
                    "po_no": toBeSaveData[c].po_no,
                    "invoice_no": toBeSaveData[c].invoice_no,
                    "po_items": [{
                        "bill_to": toBeSaveData[c].po_items[0].bill_to,
                        "ship_to": toBeSaveData[c].po_items[0].ship_to,
                        "delivery_due_date": toBeSaveData[c].po_items[0].delivery_due_date,
                        "quantity": toBeSaveData[c].po_items[0].quantity,
                        "item_cost": toBeSaveData[c].po_items[0].item_cost,
                        "tax": toBeSaveData[c].po_items[0].tax,
                        "total": toBeSaveData[c].po_items[0].total
                    }]
                })
                    .then(res => {
                        console.log(res);
                        console.log(res.data);
                    })
                setFlag(true);
                success();
            }
        }
    }


    return (

        <section >
            <header >
                <Row style={{ margin: '15px' }} >
                    <Col span={12}>
                        <Row span={24}>
                            <Upload >
                                <Button type="primary" style={{ marginRight: '15px', width: "200px" }}>Import Order From .CSV</Button>
                            </Upload>
                            <CSVLink style={{ maxHeight: '30px', marginRight: '15px', width: "200px", minWidth: '200px', borderWidth: '2px', border: 'solid', textAlign: 'center' }} data={filteredPurchaseOrderData}>Download .CSV Template</CSVLink>
                        </Row>

                    </Col>
                    <Col span={6}>

                    </Col>
                    <Col span={6}>

                        <Search
                            placeholder="Enter Title"
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: 200 }}
                        />
                    </Col>
                    <Col span={6}>

                    </Col>
                </Row>

                <Row >
                    <Col span={24}>
                        <Table
                            rowKey={filteredPurchaseOrderData => filteredPurchaseOrderData._id} column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                            pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }}
                            showQuickJumper dataSource={filteredPurchaseOrderData} columns={columns}  >
                        </Table>;

                    </Col>

                </Row>
                <Row  >
                    <Col span={12} >
                    </Col>
                </Row>
                <Row style={{ marginTop: '40px' }} >
                    <Col span={12}>


                    </Col>

                </Row>

            </header>

        </section>
    );
}

export default EditableTable