import {config} from "./discount-page-config";

export const emptyField = "--------";
export const basicOperators = ["AND", "OR", "XOR"].map(operator => {
    return {value: operator}
});
export const defaultOperator = "AND";

export const isStore = ({subject}) => {
    return subject === "store";
}

export const isStoreSubjectAndEditMode = (props) => {
    let isStoreAndEdit = false;
    if (isEditMode(props.mode)) {
        const editedDiscount = getEditedDiscount(props.policyDiscounts, props.mode);
        const {products, category} = editedDiscount.discount;
        if (products.length === 0 && !category) {
            isStoreAndEdit = true;
        }
    }
    return isStoreAndEdit;
}

export const getEditedDiscount = (discounts, mode) => {
    return discounts.filter(d => d.key === mode.editedDiscount)[0];
}

export const isEditMode = (mode) => {
    return config.modes.EDIT === mode.mode;
}

export const isEditedDiscount = (key, mode) => {
    return key === mode.editedDiscount;
}

export const removeConditionFromDiscount = (k, props) => {
    isEditMode(props.mode)
        ? props.setPolicyDiscounts(prevPolicyDiscounts => {
            return prevPolicyDiscounts.map(d => {
                return isEditedDiscount(d.key, props.mode)
                    ? {
                        ...d,
                        discount: {
                            ...d.discount,
                            condition: d.discount.condition.filter(c => c.key !== k)
                        }
                    }
                    : d
            });
        })
        : props.setDiscount(prevDiscount => {
            return {...prevDiscount, condition: [...prevDiscount.condition.filter(curr => curr.key !== k)]};
        })
}

export const getPercentage = ({mode, policyDiscounts, discount}) => {
    if (isEditMode(mode)) {
        const editedDiscount = getEditedDiscount(policyDiscounts, mode);
        return editedDiscount.discount.percentage;
    } else {
        const {percentage} = discount;
        return percentage ? percentage : 0;
    }
}

export const getPresentedProducts = (props) => {
    return props.products.map(p => {
        return {value: `${p.name}, ${p.catalogNumber}`};
    });
}

export const extractCatalogNumber = (productNameNumber) => {
    const commaIdx = productNameNumber.indexOf(',');
    const catalogNumber = productNameNumber.substring(commaIdx + 1);
    return parseInt(catalogNumber);
}

export const editProduct = (e, cond, {mode, setPolicyDiscounts, setDiscount}) => {
    isEditMode(mode)
        ? setPolicyDiscounts(prevPolicyDiscounts => {
            return prevPolicyDiscounts.map(pd => {
                return isEditedDiscount(pd.key, mode)
                    ? {
                        ...pd,
                        discount: {
                            ...pd.discount,
                            condition: pd.discount.condition.map(c => {
                                return c.key === cond.key
                                    ? {...c, condition: {...c.condition, catalogNumber: extractCatalogNumber(e)}}
                                    : c
                            })
                        }
                    }
                    : pd
            });
        })
        : setDiscount(prevDiscount => {
            return {
                ...prevDiscount,
                condition: prevDiscount.condition.map(c => {
                    return c.key === cond.key
                        ? {...c, condition: {...c.condition, catalogNumber: extractCatalogNumber(e)}}
                        : c
                })
            }
        })
}

export const editConditionOperator = (e, cond, {mode, setPolicyDiscounts, setDiscount}) => {
    isEditMode(mode)
        ? setPolicyDiscounts(prevPolicyDiscounts => {
            return prevPolicyDiscounts.map(pd => {
                return isEditedDiscount(pd.key, mode)
                    ? {
                        ...pd,
                        discount: {
                            ...pd.discount,
                            condition: pd.discount.condition.map(c => {
                                return c.key === cond.key
                                    ? {...c, operator: e}
                                    : c
                            })
                        }
                    }
                    : pd
            });
        })
        : setDiscount(prevDiscount => {
            return {
                ...prevDiscount,
                condition: prevDiscount.condition.map(c => {
                    return c.key === cond.key
                        ? {...c, operator: e}
                        : c
                })
            }
        })
}

export const increaseMinAmount = (cond, {mode, setPolicyDiscounts, setDiscount}) => {
    isEditMode(mode)
        ? setPolicyDiscounts(prevPolicyDiscounts => {
            return prevPolicyDiscounts.map(pd => {
                return isEditedDiscount(pd.key, mode)
                    ? {
                        ...pd,
                        discount: {
                            ...pd.discount,
                            condition: pd.discount.condition.map(c => {
                                return c.key === cond.key
                                    ? {...c, condition: {...c.condition, minAmount: c.condition.minAmount + 1}}
                                    : c
                            })
                        }
                    }
                    : pd
            });
        })
        : setDiscount(prevDiscount => {
            return {
                ...prevDiscount,
                condition: prevDiscount.condition.map(c => {
                    return c.key === cond.key
                        ? {...c, condition: {...c.condition, minAmount: c.condition.minAmount + 1}}
                        : c
                })
            }
        })
}

export const decreaseMinAmount = (cond, {mode, setPolicyDiscounts, setDiscount}) => {
    isEditMode(mode)
        ? setPolicyDiscounts(prevPolicyDiscounts => {
            return prevPolicyDiscounts.map(pd => {
                return isEditedDiscount(pd.key, mode)
                    ? {
                        ...pd,
                        discount: {
                            ...pd.discount,
                            condition: pd.discount.condition.map(c => {
                                return c.key === cond.key
                                    ? {...c, condition: {...c.condition, minAmount: c.condition.minAmount - 1}}
                                    : c
                            })
                        }
                    }
                    : pd
            });
        })
        : setDiscount(prevDiscount => {
            return {
                ...prevDiscount,
                condition: prevDiscount.condition.map(c => {
                    return c.key === cond.key
                        ? {...c, condition: {...c.condition, minAmount: c.condition.minAmount - 1}}
                        : c
                })
            }
        })
}



