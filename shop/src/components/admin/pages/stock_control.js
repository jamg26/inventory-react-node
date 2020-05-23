import React, { useContext, useState } from 'react';
import { UserContext } from '../../../routes/routes';
import { Button, Layout, Menu, PageHeader, Tabs } from 'antd';
import {
    ArrowRightOutlined,
} from '@ant-design/icons';
import Side from '../inc/side';
import Header from '../inc/header';


import NewPurchaseOrder from '../stock_control_ui/newPurchaseOrder';
import ActiveTransactions from '../stock_control_ui/activeTransactions';
import StockTransfer from '../stock_control_ui/stockTransfer';
import ReturnStock from '../stock_control_ui/returnStock';
import { withRouter } from 'react-router-dom';


const { Content } = Layout;
const { TabPane } = Tabs;


function Dashboard(props) {
    const [data, setData] = useState([]);


    return [
        <Layout >
            <Side no={props.no} />
            <Layout style={{ height: '100vh' }}>
                <Header />
                <Content style={{ margin: '24px 16px 24px 16px', overflow: 'initial', backgroundColor: 'white' }}>
                    <div className="site-layout-background dyn-height">
                        <PageHeader
                            className="site-page-header"
                            title="Stock Control"
                            onBack={() => props.history.goBack()}
                            extra={[
                                <Button onClick={() => { console.log(props.history); props.history.go(+1) }} type="link" className="ant-page-header-back-button" style={{ fontSize: '16px' }}><ArrowRightOutlined /></Button>,
                                ,
                            ]}
                        // subTitle="This is a subtitle"
                        />
                        <div className="pages-container">
                            <Tabs defaultActiveKey="activeTransaction" type="card" >
                                <TabPane tab="Active Transactions" key="activeTransaction">
                                    <div>
                                        <ActiveTransactions></ActiveTransactions>
                                    </div>
                                </TabPane>
                                <TabPane tab="New Purchase Order" key="newPurchaseOrder">
                                    <div>
                                        <NewPurchaseOrder></NewPurchaseOrder>
                                    </div>
                                </TabPane>
                                <TabPane tab="Stock Transfer" key="stockTransfer">
                                    <StockTransfer></StockTransfer>
                                </TabPane>
                                <TabPane tab="Return Stock" key="returnStock">
                                   <ReturnStock></ReturnStock>
                                </TabPane>
                                <TabPane tab="Stock Adjustment" key="stockAdjustment">
                                    Content of Tab Pane Stock Adjustment
                                </TabPane>
                                <TabPane tab="Inventory Count" key="inventoryCount">
                                    Content of Tab Pane Inventory Count
                                </TabPane>
                            </Tabs>
                        </div>


                    </div>
                </Content>

            </Layout>
        </Layout>
    ]
}

export default withRouter(Dashboard);