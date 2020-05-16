import {Modal} from "antd";

export function success(message) {
    Modal.success({
        content: message,
    });
}

export function warning(message) {
    Modal.warning({
        title: 'You are doing something wrong...',
        content: message,
    });
}
