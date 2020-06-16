import React, { useState } from "react";

function FB() {
  const [loggedin, setloggedin] = useState(false);

  if (loggedin) {
    return [<div>logged in</div>];
  }
  const componentClicked = () => {
    console.log("clicked");
  };
  return [
    <FacebookLogin
      appId="309671157102004"
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
