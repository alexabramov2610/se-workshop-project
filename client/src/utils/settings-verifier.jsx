import {warning} from "../components/modal/modal";

export const verifyDiscountSetting = ({discount}) => {
    if (!discount.duration || !discount.percentage) {
        warning("Discount Percentage and duration are mandatory fields");
        return false;
    }
    return true;
};

export const verifyConditionSetting = ({condition}) => {
    if (condition.condition && !condition.condition.catalogNumber || !condition.operator) {
        warning("Fill all condition fields, including product, operator and minimum amount / on discount");
        return false;
    }
    return true;
};

export const verifyProductsSetting = ({subject, discount}) => {
    if (subject === "products" && discount.products.length === 0) {
        warning("Products must be chosen for that kind of discount");
        return false;
    }
    return true;
};

export const verifyStoreSetting = ({subject, discount}) => {
    if (subject === "store" && !discount.condition[0]) {
        warning("Minimum subtotal is mandatory for sore discount");
        return false;
    }
    return true;
};


