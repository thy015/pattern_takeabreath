import React from "react";
import {notification} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck, faCircleXmark, faExclamationTriangle,} from "@fortawesome/free-solid-svg-icons";

const notificationFactory = (type, message, description) => {
  const iconMap = {
    success: faCircleCheck,
    error: faCircleXmark,
    warning: faExclamationTriangle,
  };

  const colorMap = {
    success: "green",
    error: "red",
    warning: "orange",
  };

  notification.open({
    message: (
      <div
        className="font-bold text-[16px]"
        style={{ color: colorMap[type] || "black" }}
      >
        {message}
      </div>
    ),
    description: <div className="text-[15px]">{description}</div>,
    icon: (
      <FontAwesomeIcon
        icon={iconMap[type] || faCircleXmark}
        style={{ color: colorMap[type] || "black", marginTop: "5px" }}
      />
    ),
    duration: 2,
    onClick: () => {
      console.log("Notification Clicked!");
    },
  });
};

export const openNotification = (type, message, description) => {
  notificationFactory(type, message, description);
};
