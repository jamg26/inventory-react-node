import React, { useState, useContext } from "react";
import { SettingContext } from "../../routes/routes";
function FB() {
  const setting_configuration = useContext(SettingContext);
  const [loggedin, setloggedin] = useState(false);

  if (loggedin) {
    return [<div>logged in</div>];
  }
  const componentClicked = () => {
    console.log("clicked");
  };
  return [
    <FacebookLogin
      appId={setting_configuration ? setting_configuration.fb_app_id : ""}
      autoLoad={true}
      fields="name,email,picture"
      scope="pages_messaging,pages_manage_engagement"
      onClick={componentClicked}
      callback={(response) => {
        // console.log(response);
        setloggedin(true);
      }}
    />,
  ];
}
export default FB;
