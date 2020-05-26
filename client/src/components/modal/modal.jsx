import {Modal} from "antd";

export function success(message) {
    Modal.success({
        content: message,
    });
}

export function warning(message, title = "You are doing something wrong...") {
    Modal.warning({
      title,
      content: message,
    });
  }

export function error(message) {
    Modal.error({
        title: 'You are doing something wrong...',
        content: message,
    });
}

