import { message } from 'antd';

export const success = (alert) => {
    message.success(alert);
};

export const error = (alert) => {
    message.error(alert);
};

export const warning = (alert) => {
    message.warning(alert);
};
