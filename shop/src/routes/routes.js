import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useParams,
  browserHistory,
  Link,
} from "react-router-dom";

import AccountIndex from "../components/customers/pages/index";
import AccountOrder from "../components/customers/pages/orders";
import AccountPoints from "../components/customers/pages/points";
import LandingIndex from "../components/landing/pages/index";
import LandingSignup from "../components/landing/pages/signup";
import LandingInitialComponent from "../components/landing/pages/homepage";
import AdminInitialComponent from "../components/admin/pages";
import AdminHome from "../components/admin/pages/home";
import AdminAnalytics from "../components/admin/pages/analytics";
import AdminCustomers from "../components/admin/pages/customers";
import AdminOrders from "../components/admin/pages/orders";
import AdminProducts from "../components/admin/pages/products";
import AdminUsers from "../components/admin/pages/users";
import AdminStockControl from "../components/admin/pages/stock_control";
import axios from "axios";
import { Button, Result } from "antd";
import { api_base_url, api_base_url_orders } from "../keys";
export const UserContext = React.createContext();
export const UsersContext = React.createContext();
export const FetchOrderList = React.createContext();
export const AbandonedList = React.createContext();

const RouteController = ({ setNav, orders, users, get_orders, ABorders }) => (
  // <Router basename="/accounting" forceRefresh={true}>
  <AbandonedList.Provider value={ABorders} key={0}>
    <FetchOrderList.Provider value={get_orders} key={1}>
      <UsersContext.Provider value={users} key={2}>
        <UserContext.Provider value={orders} key={3}>
          <Router basename="/ecomdemo" key={1}>
            <div key={1}>
              <Switch key={1}>
                {/* storefront ui */}
                <Route key={0} exact path="/login">
                  <LandingIndex />
                </Route>
                <Route key={1} exact path="/signup">
                  <LandingSignup />
                </Route>
                <Route key={2} exact path="/">
                  <LandingInitialComponent />
                </Route>
                {/* customer account ui */}
                <Route key={1} exact path="/account">
                  <AccountIndex no={1} />
                </Route>
                <Route key={2} exact path="/account/orders">
                  <AccountOrder no={2} />
                </Route>
                <Route key={3} exact path="/account/points">
                  <AccountPoints no={3} />
                </Route>
                <Route key={4} exact path="/account/discounts">
                  <AccountIndex no={4} />
                </Route>
                {/* admin ui */}
                <Route key={0} exact path="/web-admin">
                  <AdminInitialComponent no={0} />
                </Route>
                <Route key={1} exact path="/web-admin/home">
                  <AdminHome no={1} />
                </Route>
                <Route key={2} exact path="/web-admin/stock_control">
                  <AdminStockControl no={2} />
                </Route>

                <Route key={3} exact path="/web-admin/orders">
                  <AdminOrders no={3} />
                </Route>
                <Route key={4} exact path="/web-admin/products">
                  <AdminProducts no={4} />
                </Route>
                <Route key={5} exact path="/web-admin/customers">
                  <AdminCustomers no={5} />
                </Route>
                <Route key={6} exact path="/web-admin/analytics">
                  <AdminAnalytics no={6} />
                </Route>
                <Route key={7} exact path="/web-admin/users">
                  <AdminUsers no={7} />
                </Route>
                <Route key={6}>
                  <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={
                      <Link to="/">
                        <Button type="primary">Back Home</Button>
                      </Link>
                    }
                  />
                </Route>
              </Switch>
            </div>
          </Router>
        </UserContext.Provider>
      </UsersContext.Provider>
    </FetchOrderList.Provider>
  </AbandonedList.Provider>
);
function App() {
  const [nav, setNav] = useState(1);
  const [orders, setOrders] = useState([]);
  const [ABorders, setABOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const get_abandoned_carts = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/abandoned_orders",
      {},
      { headers: headers }
    );
    setABOrders(response.data);
  };
  const get_orders = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/orders",
      {},
      { headers: headers }
    );
    setOrders(response.data);
  };
  const get_users = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url + "/users",
      {},
      { headers: headers }
    );
    setUsers(response.data);
  };
  useEffect(() => {
    get_orders();
    get_users();
    get_abandoned_carts();
  }, []);
  return [
    <RouteController
      sample_data_context={1123}
      setNav={setNav}
      users={users}
      orders={orders}
      ABorders={ABorders}
      key={1}
      get_orders={get_orders}
    />,
  ];
}

export default App;
