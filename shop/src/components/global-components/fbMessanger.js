import React from "react";
import { Fb } from "./fb-messanger";

class CustomerChat extends React.PureComponent {
  componentDidMount() {
    this.timeout = setTimeout(() => {
      Fb(this.props.app_id, (FB) => this.timeout && FB.XFBML.parse());
    }, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    delete this.timeout;
  }

  render() {
    console.log(this.props.page_id, this.props.app_id);
    return (
      <div
        className="fb-customerchat"
        attribution="setup_tool"
        page_id={this.props.page_id}
        // page_id={"102652921495791"} //test account
        // theme_color="..."
        // logged_in_greeting="..."
        // logged_out_greeting="..."
        // greeting_dialog_display="..."
        // greeting_dialog_delay="..."
        // minimized="false"
        // ref="..."
      />
    );
  }
}

export default CustomerChat;
