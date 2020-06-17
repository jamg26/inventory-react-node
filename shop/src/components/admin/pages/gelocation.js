import React, { useEffect, useState } from "react";
import { UserContext } from "../../../routes/routes";
import {
  Button,
  Layout,
  Menu,
  PageHeader,
  Card,
  Typography,
  Input,
  Avatar,
} from "antd";
import {
  ArrowRightOutlined,
  setTwoToneColor,
  UserAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { checkAuth } from "../../helper/authCheckAdmin";
import Side from "../inc/side";
import { api_base_url } from "../../../keys";
import Header from "../inc/header";
import { withRouter } from "react-router-dom";
import LoadingPage from "../../global-components/loading";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import GoogleMapReact from "google-map-react";
var icon = process.env.PUBLIC_URL + "/logo192.png";
const mapStyles = {
  width: "100%",
  height: "100%",
};
const { Content } = Layout;
const { Text } = Typography;
function Dashboard(props) {
  const [collaped, setCollaped] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setactiveMarker] = useState({});
  const [selectedPlace, setselectedPlace] = useState({});
  const [lat, setlat] = useState(7.094271999999999);
  const [lng, setlng] = useState(125.632512);
  const [users, setUsers] = useState([]);
  const onMarkerClick = (selected_place, marker, e) => {
    console.log("marker click", selected_place, marker, e);
    setShowingInfoWindow(true);
    setactiveMarker(marker);
    setselectedPlace(selected_place);
  };

  const onClose = (props) => {
    if (showingInfoWindow) {
      setShowingInfoWindow(false);
      setactiveMarker(null);
    }
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
    checkAuth(props, setShowComponent);
    get_users();
    setInterval(() => {
      get_users();
    }, 10000);
  }, []);

  const updatelat = (e) => {
    console.log("lat", e);
    setlat(e);
  };
  const toggle = () => {
    setCollaped(!collaped);
  };
  const AnyReactComponent = (text) => <div>{text}</div>;
  if (showComponent) {
    return [
      <Layout key="0">
        {/* <Side no={props.no} /> */}
        <Layout style={{ height: "100vh" }}>
          <Header no={props.no} />
          <Content
            style={{
              margin: "0px 0px",
              overflow: "initial",
            }}
          >
            <div className=" dyn-height">
              <PageHeader
                className="site-page-header"
                title="Geolocation"

                // subTitle="This is a subtitle"asdas
              />

              <Card bodyStyle={{ height: "90vh" }}>
                <Map
                  className="google_map_container"
                  google={props.google}
                  style={mapStyles}
                  zoom={14}
                  initialCenter={{
                    lat: lat,
                    lng: lng,
                  }}
                >
                  {users.map((user, index) => {
                    console.log("user marker", user.lat, user.lng);
                    return [
                      <Marker
                        position={{ lat: user.lat, lng: user.lng }}
                        name={user.name}
                        label={user.name}
                      />,
                    ];
                  })}

                  <InfoWindow
                    // marker={activeMarker}
                    position={activeMarker}
                    // pixelOffset={new google.maps.Size(0, -30)}
                    visible={showingInfoWindow}
                    onClose={onClose}
                  >
                    <div>
                      <h4>{selectedPlace.name}</h4>
                    </div>
                  </InfoWindow>
                </Map>
              </Card>
            </div>
          </Content>
        </Layout>
      </Layout>,
    ];
  } else {
    return [<LoadingPage tip="loading page..." />];
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAnoJOBOJ6YMB6Rghn33GFUtLJBtu0jEow",
})(withRouter(Dashboard));
