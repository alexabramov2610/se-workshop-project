import * as Modal from "../../components/modal/modal";
import {config} from './discount-page-config';
import * as utils from "./discount-page-utils";

export const verifyDiscountSetting = ({mode, discount, policyDiscounts}) => {
    let valid = true;
    if (utils.isEditMode(mode)) {
        const editedDiscount = utils.getEditedDiscount(policyDiscounts, mode);
        console.log(policyDiscounts);
        valid = editedDiscount.discount.duration > -1 && editedDiscount.discount.percentage > -1;
    } else if (!discount.duration || !discount.percentage) {
        valid = false;
    }
    if (!valid) Modal.warning("Discount Percentage and duration are mandatory fields");
    return valid;
}

export const verifyConditionSetting = ({condition}) => {
    console.log("got here");
    if (condition.condition && !condition.condition.catalogNumber || !condition.operator) {
        Modal.warning("Fill all condition fields, including product, operator and minimum amount / on discount");
        return false;
    }
    return true;
};

export const verifyProductsSetting = ({subject, discount, mode, policyDiscounts}) => {
    const isAddModeAndNoProducts = mode.mode === config.modes.ADD
        && subject === "products" &&
        discount.products.length === 0;
    const isEditModeAndNoProducts = mode.mode === config.modes.EDIT
        && policyDiscounts.filter(d => d.key === mode.editedDiscount)[0].discount.products.length === 0;

    if (isAddModeAndNoProducts || isEditModeAndNoProducts) {
        Modal.warning("Products must be chosen for that kind of discount");
        return false;
    }
    return true;
};

export const verifyStoreSetting = ({subject, discount}) => {
    if (subject === "store" && !discount.condition[0]) {
        Modal.warning("Minimum subtotal is mandatory for sore discount");
        return false;
    }
    return true;
};


