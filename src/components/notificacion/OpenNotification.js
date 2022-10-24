import { notification } from "antd";

const OpenNotification = (message, description, placement, icon, callback) => {
  let notif = {
    message,
    description,
    placement,
    icon,
    onClick: () => {
      callback();
    },
  };

  notification.open({ ...notif });
};

export default OpenNotification;
