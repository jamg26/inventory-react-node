import React, { useEffect, useState, lazy, Suspense } from "react";
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
import LoadingScreen from "../components/global-components/loading";
// import AccountIndex from "../components/customers/pages/index";
// import AccountOrder from "../components/customers/pages/orders";
// import AccountPoints from "../components/customers/pages/points";
// import AccountMessage from "../components/customers/pages/messages";
// import AccountEmailling from "../components/customers/pages/emailling";
// import PaymentPage from "../components/landing/pages/payment";
// import TYPage from "../components/landing/pages/ty";
// import LandingIndex from "../components/landing/pages/index";
// import LandingSignup from "../components/landing/pages/signup";
// import LandingInitialComponent from "../components/landing/pages/homepage";
// import AdminInitialComponent from "../components/admin/pages";
// import AdminHome from "../components/admin/pages/home";
// import AdminAnalytics from "../components/admin/pages/analytics";
// import AdminCustomers from "../components/admin/pages/gelocation";
// import AdminOrders from "../components/admin/pages/orders";
// import AdminProducts from "../components/admin/pages/products";
// import AdminUsers from "../components/admin/pages/users";
// import AdminSupplier from "../components/admin/pages/suppliers";
// import AdminStockControl from "../components/admin/pages/stock_control";
// import AdminSettings from "../components/admin/pages/settings";
// import AdminSettingsTax from "../components/admin/pages/settings_taxes";
// import AdminSettingsPrice from "../components/admin/pages/settings_prices";
// import AdminMessages from "../components/admin/pages/messages";
// import AdminEmail from "../components/admin/pages/emailling";
// import AccountReport from "../components/admin/pages/reports";
// import GeolocationComponent from "../components/admin/pages/gelocation";

import axios from "axios";
import { Button, Result } from "antd";
import {
  api_base_url,
  api_base_url_products,
  api_base_url_settings,
} from "../keys";
const AdminInitialComponent = lazy(() => import("../components/admin/pages"));
const AdminCustomers = lazy(() =>
  import("../components/admin/pages/customers")
);
const AdminProducts = lazy(() => import("../components/admin/pages/products"));
const AdminUsers = lazy(() => import("../components/admin/pages/users"));
const AdminSupplier = lazy(() => import("../components/admin/pages/suppliers"));
const AdminStockControl = lazy(() =>
  import("../components/admin/pages/stock_control")
);

export const UserContext = React.createContext();
export const UsersContext = React.createContext();
export const FetchOrderList = React.createContext();
export const AbandonedList = React.createContext();
export const SettingContext = React.createContext();
export const TaxContext = React.createContext();
export const TaxRefresher = React.createContext();
export const SettingContextRefresher = React.createContext();

const RouteController = ({
  setNav,
  orders,
  users,
  get_orders,
  get_settings,
  ABorders,
  settings,
  tax,
  get_taxes,
}) => (
  // <Router basename="/accounting" forceRefresh={true}>
  <Suspense fallback={<LoadingScreen />}>
    <UsersContext.Provider value={users} key={2}>
      <SettingContext.Provider value={settings} key={4}>
        <SettingContextRefresher.Provider value={get_settings} key={5}>
          <TaxContext.Provider value={tax} key={6}>
            <TaxRefresher.Provider value={get_taxes} key={7}>
              <Router basename="/task" key={1}>
                <div key={1}>
                  <Switch key={1}>
                    <Route key={0} exact path="/">
                      <AdminInitialComponent no={0} />
                    </Route>
                    <Route key={0} exact path="/web-admin">
                      <AdminInitialComponent no={0} />
                    </Route>
                    <Route key={4} exact path="/web-admin/home">
                      <AdminProducts no={4} />
                    </Route>

                    <Route key={2} exact path="/web-admin/stock_control">
                      <AdminStockControl no={2} />
                    </Route>

                    <Route key={4} exact path="/web-admin/products">
                      <AdminProducts no={4} />
                    </Route>
                    <Route key={5} exact path="/web-admin/customers">
                      <AdminCustomers no={5} />
                    </Route>

                    <Route key={7} exact path="/web-admin/users">
                      <AdminUsers no={7} />
                    </Route>
                    <Route key={8} exact path="/web-admin/suppliers">
                      <AdminSupplier no={8} />
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
            </TaxRefresher.Provider>
          </TaxContext.Provider>
        </SettingContextRefresher.Provider>
      </SettingContext.Provider>
    </UsersContext.Provider>
  </Suspense>
);
function App() {
  const [nav, setNav] = useState(1);
  const [users, setUsers] = useState([]);
  const [settings, set_settings] = useState(undefined);
  const [tax, set_tax] = useState([]);

  const get_settings = async () => {};
  const get_taxes = async () => {};
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
    get_users();
    get_settings();
    get_taxes();
  }, []);
  return [
    <RouteController
      sample_data_context={1123}
      setNav={setNav}
      users={users}
      tax={tax}
      get_settings={get_settings}
      get_taxes={get_taxes}
      settings={settings}
      key={1}
    />,
  ];
}

export default App;
